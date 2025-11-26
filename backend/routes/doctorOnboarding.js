const express = require('express');
const router = express.Router();
const { authMiddleware, doctorOnly } = require('../middleware/auth');
const {
    getOnboardingStatus,
    saveOnboardingData,
    getOnboardingData,
    updatePracticeDetails
} = require('../controllers/doctorOnboardingController');

// All routes are protected and require doctor authentication
router.use(authMiddleware);
router.use(doctorOnly);

/**
 * @route   GET /api/doctor/onboarding/status
 * @desc    Get onboarding status and progress
 * @access  Private (Doctor only)
 */
router.get('/status', getOnboardingStatus);

/**
 * @route   GET /api/doctor/onboarding/data
 * @desc    Get complete onboarding data
 * @access  Private (Doctor only)
 */
router.get('/data', getOnboardingData);

/**
 * @route   POST /api/doctor/onboarding/save
 * @desc    Save/Update onboarding data for a specific step
 * @access  Private (Doctor only)
 * @body    { step: Number, data: Object }
 */
router.post('/save', saveOnboardingData);

/**
 * @route   PUT /api/doctor/onboarding/practice-details
 * @desc    Update practice details (availability, consultation fees)
 * @access  Private (Doctor only)
 * @body    { availability: Array, consultationFee: Object }
 */
router.put('/practice-details', updatePracticeDetails);

module.exports = router;
