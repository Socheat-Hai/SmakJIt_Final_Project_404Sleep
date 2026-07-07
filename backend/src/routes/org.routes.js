const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller'); // Activated
const authMiddleware = require('../middleware/auth.middleware'); // Activated

/**
 * @openapi
 * /api/orgs:
 *   get:
 *     tags: [Organizations]
 *     summary: Get all organizations
 *     description: Retrieve a public list of all organizations.
 *     responses:
 *       200:
 *         description: A list of organizations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Organization'
 *       500:
 *         description: Internal server error
 */
router.get('/', orgController.getAll);

/**
 * @openapi
 * /api/orgs/my:
 *   get:
 *     tags: [Organizations]
 *     summary: Get my organization profile
 *     description: Returns the organization profile owned by the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Organization details found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No organization associated with this account
 */
router.get('/my', authMiddleware, orgController.getMyOrg);

/**
 * @openapi
 * /api/orgs/register:
 *   post:
 *     tags: [Organizations]
 *     summary: Register an organization profile
 *     description: Registers organization details for an authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizationInput'
 *     responses:
 *       201:
 *         description: Organization registered successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/register', authMiddleware, orgController.register);

/**
 * @openapi
 * /api/orgs/{id}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get organization by ID
 *     description: Retrieve public information about a specific organization using its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Organization details found
 *       404:
 *         description: Organization not found
 */
router.get('/:id', orgController.getById);

/**
 * @openapi
 * /api/orgs/{id}:
 *   put:
 *     tags: [Organizations]
 *     summary: Update organization by ID
 *     description: Updates the organization's information. Restricted to the organization owner.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrganizationInput'
 *     responses:
 *       200:
 *         description: Organization information updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Organization not found
 */
router.put('/:id', authMiddleware, orgController.update);

module.exports = router;