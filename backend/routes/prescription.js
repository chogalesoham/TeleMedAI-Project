const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authMiddleware: protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Create/update prescription (doctor saves prescription)
router.post('/', prescriptionController.savePrescription);

// Get active medicines for logged-in patient (must be before /:id)
router.get('/patient/medicines/active', prescriptionController.getActiveMedicines);

// Get prescription by ID
router.get('/:id', prescriptionController.getPrescription);

// Get patient's prescriptions
router.get('/patient/:patientId', prescriptionController.getPatientPrescriptions);

// Mark prescription as viewed
router.patch('/:id/viewed', prescriptionController.markPrescriptionViewed);

module.exports = router;
