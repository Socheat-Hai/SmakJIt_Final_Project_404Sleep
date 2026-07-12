const express = require('express');
const router = express.Router();
const savedCtrl = require('../controllers/savedOpportunity.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @openapi
 * /api/saved:
 *   get:
 *     tags: [Saved]
 *     summary: List saved opportunities for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved opportunities
 */
router.get('/', authMiddleware, savedCtrl.list);

/**
 * @openapi
 * /api/saved/{oppId}:
 *   post:
 *     tags: [Saved]
 *     summary: Save an opportunity
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oppId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Saved
 */
router.post('/:oppId', authMiddleware, savedCtrl.add);

/**
 * @openapi
 * /api/saved/{oppId}:
 *   delete:
 *     tags: [Saved]
 *     summary: Unsave an opportunity
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
 *         description: Unsaved
 */
router.delete('/:oppId', authMiddleware, savedCtrl.remove);

module.exports = router;