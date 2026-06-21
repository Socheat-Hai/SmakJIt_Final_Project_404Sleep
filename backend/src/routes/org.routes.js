const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');
const authMiddleware = require('../middleware/auth.middleware');

const prisma = require('../lib/prisma');

router.get('/test-db', async (req, res) => {
  const orgs = await prisma.organization.findMany();
  res.json(orgs);
});

router.post('/register', authMiddleware, orgController.register);
router.get('/', orgController.getAll);
router.get('/my', authMiddleware, orgController.getMyOrg);
router.get('/:id', orgController.getById);
router.put('/:id', authMiddleware, orgController.update);

module.exports = router;
