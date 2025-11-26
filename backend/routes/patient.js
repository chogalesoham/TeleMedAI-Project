const express = require('express');
const router = express.Router();
const { authMiddleware, patientOnly } = require('../middleware/auth');
const patientController = require('../controllers/patientController');

// Apply auth and patient middleware to all routes
router.use(authMiddleware);
router.use(patientOnly);

// Patient routes
router.get('/profile', patientController.getPatientProfile);
router.get('/doctors', patientController.getApprovedDoctors);
router.get('/doctors/:id', patientController.getDoctorById);

module.exports = router;
