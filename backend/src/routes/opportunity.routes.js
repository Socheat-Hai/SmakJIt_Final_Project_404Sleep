const express = require('express');
const router = express.Router();
const oppController = require('../controllers/opportunity.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/', oppController.list);
router.get('/:id', oppController.getById);
router.post('/', authMiddleware, oppController.create);
router.put('/:id', authMiddleware, oppController.update);
router.delete('/:id', authMiddleware, oppController.remove);

module.exports = router;
