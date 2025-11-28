const express = require('express');
const router = express.Router();
const {
    createMedicalReport,
    getUserMedicalReports,
    getMedicalReportById,
    updateMedicalReport,
    deleteMedicalReport,
    toggleArchiveMedicalReport,
    getUserReportStats
} = require('../controllers/medicalReportController');

// Create a new medical report
router.post('/', createMedicalReport);

// Get all medical reports for a user
router.get('/user/:userId', getUserMedicalReports);

// Get user report statistics
router.get('/user/:userId/stats', getUserReportStats);

// Get a single medical report by ID
router.get('/:id', getMedicalReportById);

// Update a medical report
router.put('/:id', updateMedicalReport);

// Delete a medical report
router.delete('/:id', deleteMedicalReport);

// Archive/Unarchive a medical report
router.patch('/:id/archive', toggleArchiveMedicalReport);

module.exports = router;
