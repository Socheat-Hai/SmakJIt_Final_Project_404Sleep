const express = require('express')
const router = express.Router()
const { Op, literal } = require('sequelize')
const db = require('../models')
const { User, Organization, Opportunity, Application } = db
const requireAdmin = require('../middleware/requireAdmin');

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  const [totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs] =
    await Promise.all([
      User.count(),
      Organization.count(),
      Opportunity.count(),
      Application.count(),
      Organization.count({ where: { status: 'pending' } }),
    ])
  res.json({ totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs })
})

router.get('/orgs', async (req, res) => {
  const { status } = req.query;
  const where = status && status !== 'all' ? { status } : {};
  const orgs = await Organization.findAll({
    where,
    include: [
      { model: User, as: 'owner', attributes: ['full_name', 'email', 'created_at'] },
    ],
    order: [['created_at', 'DESC']],
  })
  res.json(orgs)
})

router.get('/orgs/pending', async (req, res) => {
  const orgs = await Organization.findAll({
    where: { status: 'pending' },
    include: [
      { model: User, as: 'owner', attributes: ['full_name', 'email', 'created_at'] },
    ],
    order: [['created_at', 'ASC']],
  })
  res.json(orgs)
})

router.patch('/orgs/:id/approve', async (req, res) => {
  const [, [org]] = await Organization.update(
    { status: 'approved' },
    { where: { org_id: parseInt(req.params.id) }, returning: true },
  )
  res.json({ message: 'Approved', org })
})

router.patch('/orgs/:id/reject', async (req, res) => {
  const [, [org]] = await Organization.update(
    { status: 'rejected' },
    { where: { org_id: parseInt(req.params.id) }, returning: true },
  )
  res.json({ message: 'Rejected', org })
})

router.get('/orgs/:id/checklist', async (req, res) => {
  const org = await Organization.findByPk(parseInt(req.params.id))
  if (!org) return res.status(404).json({ message: 'Organization not found' })

  const checklist = {
    has_name: !!org.name,
    has_description: !!org.description,
    has_contact_email: !!org.contact_email,
    has_contact_phone: !!org.contact_phone,
    has_location: !!org.location,
    has_website: !!org.website,
    has_logo: !!org.logo,
    has_social_link: !!org.website,
  }
  const allComplete = Object.values(checklist).every(Boolean)
  res.json({ checklist, allComplete, org_status: org.status })
})

router.get('/users', async (req, res) => {
  const { search, role, status } = req.query;
  const where = {};
  if (role && role !== 'all') where.role = role;
  if (status && status !== 'all') where.status = status;
  if (search) {
    where[Op.or] = [
      { full_name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const users = await User.findAll({
    where,
    attributes: ['user_id', 'full_name', 'email', 'role', 'status', 'created_at'],
    include: [
      { model: Organization, as: 'organization', attributes: ['status', 'org_id'] },
    ],
    order: [['created_at', 'DESC']],
  })
  const mapped = users.map((u) => ({
    ...u.get({ plain: true }),
    id: u.user_id,
    name: u.full_name,
    role: u.role,
    verificationStatus: u.organization?.status || null,
  }))
  res.json(mapped)
})

router.patch('/users/:id/suspend', async (req, res) => {
  const [, [user]] = await User.update(
    { status: 'banned' },
    { where: { user_id: parseInt(req.params.id) }, returning: true },
  )
  res.json({ message: 'User suspended', user })
})

router.patch('/users/:id/activate', async (req, res) => {
  const [, [user]] = await User.update(
    { status: 'active' },
    { where: { user_id: parseInt(req.params.id) }, returning: true },
  )
  res.json({ message: 'User activated', user })
})

router.get('/opportunities', async (req, res) => {
  const { search, status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const opps = await Opportunity.findAll({
    where,
    attributes: {
      include: [
        [
          literal('(SELECT COUNT(*) FROM "Application" WHERE "Application"."opp_id" = "Opportunity"."opp_id")'),
          'applicationCount',
        ],
      ],
    },
    include: [
      { model: Organization, as: 'organization', attributes: ['name'] },
    ],
    order: [['created_at', 'DESC']],
  })
  const mapped = opps.map((o) => {
    const plain = o.get({ plain: true });
    return {
      ...plain,
      _count: { applications: Number(plain.applicationCount) || 0 },
      applicationCount: undefined,
    };
  }).map((o) => ({
    ...o,
    id: o.opp_id,
    orgName: o.organization?.name,
    applicants: o._count.applications,
  }))
  res.json(mapped)
})

router.delete('/opportunities/:id', async (req, res) => {
  await Opportunity.destroy({ where: { opp_id: parseInt(req.params.id) } })
  res.json({ message: 'Opportunity deleted' })
})

router.get('/applications', async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;
  const apps = await Application.findAll({
    where,
    include: [
      { model: Opportunity, as: 'opportunity', attributes: ['title', 'opp_id'] },
      { model: User, as: 'user', attributes: ['full_name', 'email'] },
    ],
    order: [['applied_at', 'DESC']],
  })
  const mapped = apps.map((a) => ({
    ...a.get({ plain: true }),
    id: a.application_id,
    _id: a.application_id,
    opportunityTitle: a.opportunity?.title,
    volunteerName: a.user?.full_name,
    volunteerEmail: a.user?.email,
    createdAt: a.applied_at,
  }))
  res.json(mapped)
})

module.exports = router;
