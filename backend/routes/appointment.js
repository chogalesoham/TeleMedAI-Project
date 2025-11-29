const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create appointment (Patient books)
router.post('/', appointmentController.createAppointment);

// Get appointments - IMPORTANT: Specific routes must come BEFORE /:id
router.get('/stats', appointmentController.getAppointmentStats);
router.get('/patient', appointmentController.getPatientAppointments);
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
router.get('/doctor', appointmentController.getDoctorAppointments);
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);

// Update appointment status
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.patch('/:id/complete', appointmentController.completeAppointment);

// Get single appointment - MUST be last among GET routes
router.get('/:id', appointmentController.getAppointmentById);

module.exports = router;
