const express = require('express');
const router = express.Router();
const categoryRepository = require('../repositories/category.repository');

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
