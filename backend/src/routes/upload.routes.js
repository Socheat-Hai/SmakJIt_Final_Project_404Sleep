const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.post('/profile-photo', authMiddleware, upload.single('photo'), uploadController.uploadProfilePhoto);
router.post('/org-logo', authMiddleware, upload.single('logo'), uploadController.uploadOrgLogo);
router.post('/opportunity-image', authMiddleware, upload.single('image'), uploadController.uploadOpportunityImage);

module.exports = router;
