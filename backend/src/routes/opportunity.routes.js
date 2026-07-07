const express = require('express');
const router = express.Router();
const oppController = require('../controllers/opportunity.controller'); 
const authMiddleware = require('../middleware/auth.middleware'); 

/**
 * @openapi
 * /api/opportunities:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get all opportunities
 *     description: Retrieve a public list of all active volunteer opportunities.
 *     responses:
 *       200:
 *         description: A list of opportunities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Opportunity'
 *       500:
 *         description: Internal server error
 */
router.get('/', oppController.list);

/**
 * @openapi
 * /api/opportunities/recommended:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get recommended opportunities
 *     description: Returns a list of volunteer opportunities matching the logged-in user's profile and skills.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended opportunities found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Opportunity'
 *       401:
 *         description: Unauthorized
 */
router.get('/recommended', authMiddleware, oppController.getRecommended);

/**
 * @openapi
 * /api/opportunities/{id}:
 *   get:
 *     tags: [Opportunities]
 *     summary: Get opportunity by ID
 *     description: Retrieve public information and detailed requirements about a specific volunteer opportunity.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Opportunity details found
 *       404:
 *         description: Opportunity not found
 */
router.get('/:id', oppController.getById);

/**
 * @openapi
 * /api/opportunities:
 *   post:
 *     tags: [Opportunities]
 *     summary: Create a new opportunity
 *     description: Creates a new volunteer posting. Restricted to authenticated organizations or admins.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OpportunityInput'
 *     responses:
 *       201:
 *         description: Opportunity created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, oppController.create);

/**
 * @openapi
 * /api/opportunities/{id}:
 *   put:
 *     tags: [Opportunities]
 *     summary: Update an opportunity
 *     description: Updates an existing volunteer posting by its unique ID.
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
 *             $ref: '#/components/schemas/OpportunityInput'
 *     responses:
 *       200:
 *         description: Opportunity details updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Opportunity not found
 */
router.put('/:id', authMiddleware, oppController.update);

/**
 * @openapi
 * /api/opportunities/{id}:
 *   delete:
 *     tags: [Opportunities]
 *     summary: Delete an opportunity
 *     description: Permanently removes an opportunity posting from the system.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Opportunity removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Opportunity not found
 */
router.delete('/:id', authMiddleware, oppController.remove);

module.exports = router;