const express      = require('express')
const router       = express.Router()
const prisma       = require('../lib/prisma')
const requireAdmin = require('../middleware/requireAdmin');

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  const [totalUsers, totalOrgs, totalOpportunities, totalApplications] =
    await Promise.all([
      prisma.user.count(),
      prisma.organization.count(),
      prisma.opportunity.count(),
      prisma.application.count(),
    ])
  res.json({ totalUsers, totalOrgs, totalOpportunities, totalApplications })
})

router.get('/orgs/pending', async (req, res) => {
  const orgs = await prisma.organization.findMany({
    where: { status: 'pending' },
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

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { user_id: true, full_name: true, email: true,
              user_type: true, status: true, created_at: true },
    orderBy: { created_at: 'desc' },
  })
  res.json(users)
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

module.exports = router;
