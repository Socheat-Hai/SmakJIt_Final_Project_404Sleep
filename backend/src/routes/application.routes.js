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
 *     description: Submits a new application with optional answers to custom questions.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [opp_id]
 *             properties:
 *               opp_id:
 *                 type: integer
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_text:
 *                       type: string
 *                     answer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Application submitted
 *       400:
 *         description: Validation error
 *       409:
 *         description: Already applied
 */
router.post('/', authMiddleware, applicationController.submit);

/**
 * @openapi
 * /api/applications/mine:
 *   get:
 *     tags: [Applications]
 *     summary: Get my applications
 *     description: Returns the authenticated volunteer's applications with answers.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's applications
 */
router.get('/mine', authMiddleware, applicationController.myApplications);
router.get('/org', authMiddleware, applicationController.orgApplications);

/**
 * @openapi
 * /api/applications/opportunity/{oppId}:
 *   get:
 *     tags: [Applications]
 *     summary: List applications by opportunity
 *     description: Returns all applications for a specific opportunity (NGO dashboard).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oppId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of applications with answers
 */
router.get('/opportunity/:oppId', authMiddleware, applicationController.listByOpportunity);

/**
 * @openapi
 * /api/applications/{id}/answers:
 *   get:
 *     tags: [Applications]
 *     summary: Get answers for an application
 *     description: Returns all answer records for a specific application.
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
 *         description: List of answers
 *       404:
 *         description: Application not found
 */
router.get('/:id/answers', authMiddleware, applicationController.getAnswers);

/**
 * @openapi
 * /api/applications/{id}/stage:
 *   patch:
 *     tags: [Applications]
 *     summary: Update application pipeline stage
 *     description: Moves an application to a new stage in the tracking pipeline.
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
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [submitted, reviewing, interview, accepted, rejected]
 *     responses:
 *       200:
 *         description: Application stage updated
 *       400:
 *         description: Invalid status
 *       404:
 *         description: Application not found
 */
router.patch('/:id/stage', authMiddleware, applicationController.updateStage);

module.exports = router;
