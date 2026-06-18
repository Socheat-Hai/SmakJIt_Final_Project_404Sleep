const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/', authMiddleware, applicationController.submit);
router.get('/mine', authMiddleware, applicationController.myApplications);
router.get('/opportunity/:oppId', authMiddleware, applicationController.listByOpportunity);
router.patch('/:id/review', authMiddleware, applicationController.review);

module.exports = router;
