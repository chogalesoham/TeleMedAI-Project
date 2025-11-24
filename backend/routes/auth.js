const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  patientSignup,
  patientLogin,
  getCurrentUser,
  logout,
  changePassword,
  updateProfile
} = require('../controllers/authController');

/**
 * @route   POST /api/auth/patient/signup
 * @desc    Register a new patient
 * @access  Public
 */
router.post('/patient/signup', patientSignup);

/**
 * @route   POST /api/auth/patient/login
 * @desc    Login patient and return JWT token
 * @access  Public
 */
router.post('/patient/login', patientLogin);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authMiddleware, logout);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authMiddleware, changePassword);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
