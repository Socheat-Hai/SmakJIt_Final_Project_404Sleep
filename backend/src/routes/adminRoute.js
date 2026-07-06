const express = require('express')
const router = express.Router()
const requireAdmin = require('../middleware/requireAdmin');
const userRepository = require('../repositories/user.repository');
const orgRepository = require('../repositories/organization.repository');
const oppRepository = require('../repositories/opportunity.repository');
const appRepository = require('../repositories/application.repository');
const db = require('../models');

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  const [totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs] =
    await Promise.all([
      userRepository.count(),
      orgRepository.count(),
      oppRepository.count(),
      appRepository.count(),
      orgRepository.count({ status: 'pending' }),
    ])
  res.json({ totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs })
})

router.get('/orgs', async (req, res) => {
  const { status } = req.query;
  const where = status && status !== 'all' ? { status } : {};
  const orgs = await orgRepository.findAll(where)
  res.json(orgs)
})

router.get('/orgs/pending', async (req, res) => {
  const orgs = await orgRepository.findAll({ status: 'pending' })
  res.json(orgs)
})

router.patch('/orgs/:id/approve', async (req, res) => {
  const org = await orgRepository.updateById(parseInt(req.params.id), { status: 'approved' })
  res.json({ message: 'Approved', org })
})

router.patch('/orgs/:id/reject', async (req, res) => {
  const org = await orgRepository.updateById(parseInt(req.params.id), { status: 'rejected' })
  res.json({ message: 'Rejected', org })
})

router.get('/orgs/:id/checklist', async (req, res) => {
  const org = await orgRepository.findById(parseInt(req.params.id))
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
  const users = await userRepository.findAllWithFilters({
    search,
    role,
    status,
    attributes: ['user_id', 'full_name', 'email', 'role', 'status', 'created_at'],
    include: [
      { association: 'organization', attributes: ['status', 'org_id'] },
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
  await userRepository.update(parseInt(req.params.id), { status: 'banned' })
  res.json({ message: 'User suspended' })
})

router.patch('/users/:id/activate', async (req, res) => {
  await userRepository.update(parseInt(req.params.id), { status: 'active' })
  res.json({ message: 'User activated' })
})

router.get('/opportunities', async (req, res) => {
  const { search, status } = req.query;
  const opps = await oppRepository.findAllWithCount({
    search,
    status,
    include: [
      { model: db.Organization, as: 'organization', attributes: ['name'] },
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
  await oppRepository.remove(parseInt(req.params.id))
  res.json({ message: 'Opportunity deleted' })
})

router.get('/applications', async (req, res) => {
  const { status } = req.query;
  const apps = await appRepository.findAllWithIncludes({
    status,
    include: [
      { model: db.Opportunity, as: 'opportunity', attributes: ['title', 'opp_id'] },
      { model: db.User, as: 'user', attributes: ['full_name', 'email'] },
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
