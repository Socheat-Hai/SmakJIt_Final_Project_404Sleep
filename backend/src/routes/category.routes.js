const express = require('express');
const router = express.Router();
const { literal } = require('sequelize');
const db = require('../models');
const { Category, Opportunity } = db;

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: {
        include: [
          [
            literal('(SELECT COUNT(*) FROM "Opportunity" WHERE "Opportunity"."category_id" = "Category"."category_id")'),
            'opportunityCount',
          ],
        ],
      },
      order: [['category_name', 'ASC']],
    });

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
