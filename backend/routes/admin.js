const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Admin middleware to check if user has admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
  next();
};

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminOnly);

// Patient management routes
router.get('/patients', adminController.getAllPatients);
router.get('/patients/stats', adminController.getPatientStats);
router.get('/patients/:id', adminController.getPatientById);
router.patch('/patients/:id/status', adminController.updatePatientStatus);

module.exports = router;
