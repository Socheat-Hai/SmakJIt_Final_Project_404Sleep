const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { docUpload } = require('../middleware/upload.middleware');
const uploadController = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @openapi
 * /api/upload/profile-photo:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload a profile photo
 *     description: Uploads a profile photo for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photo]
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Profile photo file (image)
 *     responses:
 *       200:
 *         description: Photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /uploads/photos/photo-abc123.png
 *                 message:
 *                   type: string
 *                   example: Profile photo uploaded
 *       400:
 *         description: No file provided or invalid file
 */
router.post('/profile-photo', authMiddleware, upload.single('photo'), uploadController.uploadProfilePhoto);

/**
 * @openapi
 * /api/upload/org-logo:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload an organization logo
 *     description: Uploads a logo for the authenticated user's organization.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [logo]
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Organization logo file (image)
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /uploads/logos/logo-abc123.png
 *                 message:
 *                   type: string
 *                   example: Organization logo uploaded
 */
router.post('/org-logo', authMiddleware, upload.single('logo'), uploadController.uploadOrgLogo);

/**
 * @openapi
 * /api/upload/opportunity-image:
 *   post:
 *     tags: [Uploads]
 *     summary: Upload an opportunity image
 *     description: Uploads an image for an opportunity.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Opportunity image file (image)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: /uploads/opportunities/img-abc123.png
 *                 message:
 *                   type: string
 *                   example: Opportunity image uploaded
 */
router.post('/opportunity-image', authMiddleware, upload.single('image'), uploadController.uploadOpportunityImage);

router.post('/document', authMiddleware, (req, res, next) => {
  docUpload.single('document')(req, res, (err) => {
    if (err) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 10MB.'
        : err.message || 'File upload failed';
      return res.status(400).json({ message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const url = `/uploads/documents/${req.file.filename}`;
    res.json({ url, filename: req.file.originalname });
  });
});

module.exports = router;
