const express      = require('express')
const router       = express.Router()
const prisma       = require('../lib/prisma')
const requireAdmin = require('../middleware/requireAdmin');

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  const [totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs] =
    await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.opportunity.count(),
      prisma.application.count(),
      prisma.organization.count({ where: { status: 'pending' } }),
    ])
  res.json({ totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs })
})

router.get('/orgs', async (req, res) => {
  const { status } = req.query;
  const where = status && status !== 'all' ? { status } : {};
  const orgs = await prisma.organization.findMany({
    where,
    include: {
      user: { select: { full_name: true, email: true, created_at: true } },
    },
    orderBy: { created_at: 'desc' },
  })
  res.json(orgs)
})

router.get('/orgs/pending', async (req, res) => {
  const orgs = await prisma.organization.findMany({
    where: { status: 'pending' },
    include: {
      user: { select: { full_name: true, email: true, created_at: true } },
    },
    orderBy: { created_at: 'asc' },
  })
  res.json(orgs)
})

router.patch('/orgs/:id/approve', async (req, res) => {
  const org = await prisma.organization.update({
    where: { org_id: parseInt(req.params.id) },
    data:  { status: 'approved', reviewed_by: req.user.user_id },
  })
  res.json({ message: 'Approved', org })
})

router.patch('/orgs/:id/reject', async (req, res) => {
  const org = await prisma.organization.update({
    where: { org_id: parseInt(req.params.id) },
    data:  { status: 'rejected', reviewed_by: req.user.user_id },
  })
  res.json({ message: 'Rejected', org })
})

router.get('/orgs/:id/checklist', async (req, res) => {
  const org = await prisma.organization.findUnique({
    where: { org_id: parseInt(req.params.id) },
  })
  if (!org) return res.status(404).json({ message: 'Organization not found' })

  const checklist = {
    has_name: !!org.name,
    has_description: !!org.description,
    has_contact_email: !!org.contact_email,
    has_contact_phone: !!org.contact_phone,
    has_location: !!org.location,
    has_website: !!org.website,
    has_logo: !!org.logo,
    has_social_link: !!org.social_link,
  }
  const allComplete = Object.values(checklist).every(Boolean)
  res.json({ checklist, allComplete, org_status: org.status })
})

router.get('/users', async (req, res) => {
  const { search, role, status } = req.query;
  const where = {};
  if (role && role !== 'all') where.user_type = role;
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { full_name: { contains: search } },
      { email: { contains: search } },
    ];
  }
  const users = await prisma.user.findMany({
    where,
    select: {
      user_id: true, full_name: true, email: true,
      user_type: true, status: true, created_at: true,
      organization: { select: { status: true, org_id: true } },
    },
    orderBy: { created_at: 'desc' },
  })
  const mapped = users.map((u) => ({
    ...u,
    id: u.user_id,
    name: u.full_name,
    role: u.user_type,
    verificationStatus: u.organization?.status || null,
  }))
  res.json(mapped)
})

router.patch('/users/:id/suspend', async (req, res) => {
  const user = await prisma.user.update({
    where: { user_id: parseInt(req.params.id) },
    data:  { status: 'banned' },
  })
  res.json({ message: 'User suspended', user })
})

router.patch('/users/:id/activate', async (req, res) => {
  const user = await prisma.user.update({
    where: { user_id: parseInt(req.params.id) },
    data:  { status: 'active' },
  })
  res.json({ message: 'User activated', user })
})

router.get('/opportunities', async (req, res) => {
  const { search, status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }
  const opps = await prisma.opportunity.findMany({
    where,
    include: {
      organization: { select: { name: true } },
      _count: { select: { applications: true } },
    },
    orderBy: { created_at: 'desc' },
  })
  const mapped = opps.map((o) => ({
    ...o,
    id: o.opp_id,
    orgName: o.organization?.name,
    applicants: o._count.applications,
  }))
  res.json(mapped)
})

router.delete('/opportunities/:id', async (req, res) => {
  await prisma.opportunity.delete({ where: { opp_id: parseInt(req.params.id) } })
  res.json({ message: 'Opportunity deleted' })
})

router.get('/applications', async (req, res) => {
  const { status } = req.query;
  const where = {};
  if (status && status !== 'all') where.status = status;
  const apps = await prisma.application.findMany({
    where,
    include: {
      opportunity: { select: { title: true, opp_id: true } },
      volunteer: { include: { user: { select: { full_name: true, email: true } } } },
    },
    orderBy: { applied_at: 'desc' },
  })
  const mapped = apps.map((a) => ({
    ...a,
    id: a.application_id,
    _id: a.application_id,
    opportunityTitle: a.opportunity?.title,
    volunteerName: a.volunteer?.user?.full_name,
    volunteerEmail: a.volunteer?.user?.email,
    createdAt: a.applied_at,
  }))
  res.json(mapped)
})

module.exports = router;
