const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @openapi
 * /api/applications:
 *   post:
 *     tags: [Applications]
 *     summary: Submit an application
 *     description: Submits a new application for an opportunity.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationInput'
 *     responses:
 *       201:
 *         description: Application submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authMiddleware, applicationController.submit);

/**
 * @openapi
 * /api/applications/mine:
 *   get:
 *     tags: [Applications]
 *     summary: Get my applications
 *     description: Returns the authenticated user's applications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/mine', authMiddleware, applicationController.myApplications);

/**
 * @openapi
 * /api/applications/opportunity/{oppId}:
 *   get:
 *     tags: [Applications]
 *     summary: List applications by opportunity
 *     description: Returns all applications for a specific opportunity.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oppId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Opportunity ID
 *     responses:
 *       200:
 *         description: List of applications for the opportunity
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 */
router.get('/opportunity/:oppId', authMiddleware, applicationController.listByOpportunity);

/**
 * @openapi
 * /api/applications/{id}/review:
 *   patch:
 *     tags: [Applications]
 *     summary: Review an application
 *     description: Accepts or rejects an application.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Application reviewed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application'
 *       404:
 *         description: Application not found
 */
router.patch('/:id/review', authMiddleware, applicationController.review);

module.exports = router;
