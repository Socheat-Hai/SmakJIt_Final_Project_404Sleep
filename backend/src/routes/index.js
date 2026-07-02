const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoute');
const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const orgRoutes = require('./org.routes');
const opportunityRoutes = require('./opportunity.routes');
const applicationRoutes = require('./application.routes');
const uploadRoutes = require('./upload.routes');
const categoryRoutes = require('./category.routes');

router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/orgs', orgRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/upload', uploadRoutes);
router.use('/categories', categoryRoutes);

module.exports = router;
