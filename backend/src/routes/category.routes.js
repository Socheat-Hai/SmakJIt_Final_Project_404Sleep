const express = require('express');
const router = express.Router();
const categoryRepository = require('../repositories/category.repository');

/**
 * @openapi
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     description: Returns a list of all opportunity categories with opportunity counts.
 *     responses:
 *       200:
 *         description: List of categories with counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category_id:
 *                     type: integer
 *                     example: 1
 *                   category_name:
 *                     type: string
 *                     example: Environment
 *                   description:
 *                     type: string
 *                     example: Environmental conservation activities.
 *                   _count:
 *                     type: object
 *                     properties:
 *                       opportunities:
 *                         type: integer
 *                         example: 12
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', async (req, res) => {
  try {
    const categories = await categoryRepository.findAllWithCounts();
    const result = categories.map((c) => {
      const plain = c.get({ plain: true });
      return {
        ...plain,
        _count: { opportunities: Number(plain.opportunityCount) || 0 },
        opportunityCount: undefined,
      };
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;