const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');
const authMiddleware = require('../middleware/auth.middleware');
const orgRepository = require('../repositories/organization.repository');

router.get('/test-db', async (req, res) => {
  const orgs = await orgRepository.findAll();
  res.json(orgs);
});

router.post('/register', authMiddleware, orgController.register);
router.get('/', orgController.getAll);
router.get('/my', authMiddleware, orgController.getMyOrg);
router.get('/:id', orgController.getById);
router.put('/:id', authMiddleware, orgController.update);

module.exports = router;
