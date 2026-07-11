const express = require('express')
const router = express.Router()
const requireAdmin = require('../middleware/requireAdmin');
const userRepository = require('../repositories/user.repository');
const orgRepository = require('../repositories/organization.repository');
const oppRepository = require('../repositories/opportunity.repository');
const appRepository = require('../repositories/application.repository');
const db = require('../models');

router.use(requireAdmin);

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Get admin dashboard stats
 *     description: Returns aggregate statistics for the admin dashboard.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStats'
 */
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs] =
      await Promise.all([
        userRepository.count(),
        orgRepository.count(),
        oppRepository.count(),
        appRepository.count(),
        orgRepository.count({ status: 'pending' }),
      ])
    res.json({ totalUsers, totalOrgs, totalOpportunities, totalApplications, pendingOrgs })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/orgs:
 *   get:
 *     tags: [Admin]
 *     summary: List organizations (admin)
 *     description: Returns organizations filtered by status.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, pending, approved, rejected]
 *         description: Filter by organization status
 *     responses:
 *       200:
 *         description: List of organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get('/orgs', async (req, res) => {
  try {
    const { status } = req.query;
    const where = status && status !== 'all' ? { status } : {};
    const orgs = await orgRepository.findAll(where)
    res.json(orgs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/orgs/pending:
 *   get:
 *     tags: [Admin]
 *     summary: List pending organizations
 *     description: Returns organizations with pending status.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending organizations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 */
router.get('/orgs/pending', async (req, res) => {
  try {
    const orgs = await orgRepository.findAll({ status: 'pending' })
    res.json(orgs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/orgs/{id}/approve:
 *   patch:
 *     tags: [Admin]
 *     summary: Approve an organization
 *     description: Approves a pending organization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Approved
 *                 org:
 *                   $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.patch('/orgs/:id/approve', async (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const org = await orgRepository.updateById(orgId, {
      status: 'approved',
      reviewed_by: req.user.user_id,
      reviewed_at: new Date(),
    });
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const emailService = require('../services/email.service');
    const owner = await orgRepository.findById(orgId);
    if (owner?.owner?.email) {
      await emailService.sendOrgApproved(owner.owner.email, org.name);
    }

    res.json({ message: 'Approved', org });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

/**
 * @openapi
 * /api/admin/orgs/{id}/reject:
 *   patch:
 *     tags: [Admin]
 *     summary: Reject an organization
 *     description: Rejects a pending organization.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Rejected
 *                 org:
 *                   $ref: '#/components/schemas/Organization'
 *       404:
 *         description: Organization not found
 */
router.patch('/orgs/:id/reject', async (req, res) => {
  try {
    const orgId = parseInt(req.params.id);
    const { reason } = req.body;
    const org = await orgRepository.updateById(orgId, {
      status: 'rejected',
      reviewed_by: req.user.user_id,
      reviewed_at: new Date(),
    });
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const emailService = require('../services/email.service');
    const owner = await orgRepository.findById(orgId);
    if (owner?.owner?.email) {
      await emailService.sendOrgRejected(owner.owner.email, org.name, reason || '');
    }

    res.json({ message: 'Rejected', org });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

/**
 * @openapi
 * /api/admin/orgs/{id}/checklist:
 *   get:
 *     tags: [Admin]
 *     summary: Get organization readiness checklist
 *     description: Returns a checklist showing which fields the organization has completed.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Readiness checklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 checklist:
 *                   type: object
 *                   properties:
 *                     has_name:
 *                       type: boolean
 *                     has_description:
 *                       type: boolean
 *                     has_contact_email:
 *                       type: boolean
 *                     has_contact_phone:
 *                       type: boolean
 *                     has_location:
 *                       type: boolean
 *                     has_website:
 *                       type: boolean
 *                     has_logo:
 *                       type: boolean
 *                     has_social_link:
 *                       type: boolean
 *                 allComplete:
 *                   type: boolean
 *                 org_status:
 *                   type: string
 *       404:
 *         description: Organization not found
 */
router.get('/orgs/:id/checklist', async (req, res) => {
  try {
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
      has_social_link: !!org.social_link, // FIX: was incorrectly checking org.website
    }
    const allComplete = Object.values(checklist).every(Boolean)
    res.json({ checklist, allComplete, org_status: org.status })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: List users (admin)
 *     description: Returns users with optional search, role, and status filters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [volunteer, organization, admin]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, banned, inactive]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Filtered list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                   full_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   verificationStatus:
 *                     type: string
 *                     nullable: true
 */
router.get('/users', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/users/{id}/suspend:
 *   patch:
 *     tags: [Admin]
 *     summary: Suspend a user
 *     description: Bans a user account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User suspended
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User suspended
 *       404:
 *         description: User not found
 */
router.patch('/users/:id/suspend', async (req, res) => {
  try {
    const user = await userRepository.findById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' })
    await userRepository.update(parseInt(req.params.id), { status: 'banned' })
    res.json({ message: 'User suspended' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/users/{id}/activate:
 *   patch:
 *     tags: [Admin]
 *     summary: Activate a user
 *     description: Activates a previously suspended user account.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User activated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User activated
 *       404:
 *         description: User not found
 */
router.patch('/users/:id/activate', async (req, res) => {
  try {
    const user = await userRepository.findById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ message: 'User not found' })
    await userRepository.update(parseInt(req.params.id), { status: 'active' })
    res.json({ message: 'User activated' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/opportunities:
 *   get:
 *     tags: [Admin]
 *     summary: List opportunities (admin)
 *     description: Returns all opportunities with optional search and status filters.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, cancelled]
 *         description: Filter by opportunity status
 *     responses:
 *       200:
 *         description: Filtered list of opportunities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   opp_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   status:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   id:
 *                     type: integer
 *                   orgName:
 *                     type: string
 *                   applicants:
 *                     type: integer
 */
router.get('/opportunities', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/opportunities/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete an opportunity (admin)
 *     description: Deletes an opportunity and its related records by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Opportunity ID
 *     responses:
 *       200:
 *         description: Opportunity deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Opportunity deleted
 *       404:
 *         description: Opportunity not found
 */
router.delete('/opportunities/:id', async (req, res) => {
  try {
    const oppId = parseInt(req.params.id);
    const opp = await oppRepository.findById(oppId);
    if (!opp) return res.status(404).json({ message: 'Opportunity not found' })

    // FIX: Clean up related records before deleting to prevent orphans
    await db.OpportunitySkill.destroy({ where: { opportunity_id: oppId } });
    await db.SavedOpportunity.destroy({ where: { opp_id: oppId } });
    await db.Application.destroy({ where: { opp_id: oppId } });
    await oppRepository.remove(oppId)
    res.json({ message: 'Opportunity deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

/**
 * @openapi
 * /api/admin/applications:
 *   get:
 *     tags: [Admin]
 *     summary: List applications (admin)
 *     description: Returns all applications with optional status filter.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected]
 *         description: Filter by application status
 *     responses:
 *       200:
 *         description: Filtered list of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   application_id:
 *                     type: integer
 *                   user_id:
 *                     type: integer
 *                   opp_id:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   applied_at:
 *                     type: string
 *                     format: date-time
 *                   id:
 *                     type: integer
 *                   _id:
 *                     type: integer
 *                   opportunityTitle:
 *                     type: string
 *                   volunteerName:
 *                     type: string
 *                   volunteerEmail:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get('/applications', async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router;
