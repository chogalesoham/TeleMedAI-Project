const express = require('express');
const router = express.Router();
const { authMiddleware, patientOnly } = require('../middleware/auth');
const {
  getOnboardingStatus,
  saveOnboardingData,
  getOnboardingData,
  updateMedicalInfo
} = require('../controllers/onboardingController');

// All routes are protected and require patient authentication
router.use(authMiddleware);
router.use(patientOnly);

/**
 * @route   GET /api/patient/onboarding/status
 * @desc    Get onboarding status and progress
 * @access  Private (Patient only)
 */
router.get('/status', getOnboardingStatus);

/**
 * @route   GET /api/patient/onboarding/data
 * @desc    Get complete onboarding data
 * @access  Private (Patient only)
 */
router.get('/data', getOnboardingData);

/**
 * @route   POST /api/patient/onboarding/save
 * @desc    Save/Update onboarding data for a specific step
 * @access  Private (Patient only)
 * @body    { step: Number, data: Object }
 */
router.post('/save', saveOnboardingData);

/**
 * @route   PUT /api/patient/onboarding/medical-info
 * @desc    Update medical information (allergies, conditions, emergency contacts)
 * @access  Private (Patient only)
 * @body    { allergies: Array, chronicConditions: Array, emergencyContacts: Array }
 */
router.put('/medical-info', updateMedicalInfo);

module.exports = router;
