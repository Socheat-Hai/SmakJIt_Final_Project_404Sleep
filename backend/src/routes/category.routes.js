const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { opportunities: true } } },
      orderBy: { category_name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
