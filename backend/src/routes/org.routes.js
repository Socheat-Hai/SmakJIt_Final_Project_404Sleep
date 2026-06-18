const express = require('express');
const router = express.Router();
const orgController = require('../controllers/org.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/register', orgController.register);
router.get('/', orgController.getAll);
router.get('/my', authMiddleware, orgController.getMyOrg);
router.get('/:id', orgController.getById);
router.put('/:id', authMiddleware, orgController.update);

module.exports = router;
