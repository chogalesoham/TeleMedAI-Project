const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Create appointment (Patient books)
router.post('/', appointmentController.createAppointment);

// Get appointments
router.get('/patient/:patientId', appointmentController.getPatientAppointments);
router.get('/doctor/:doctorId', appointmentController.getDoctorAppointments);
router.get('/stats', appointmentController.getAppointmentStats);
router.get('/:id', appointmentController.getAppointmentById);

// Update appointment status
router.patch('/:id/status', appointmentController.updateAppointmentStatus);
router.patch('/:id/complete', appointmentController.completeAppointment);

module.exports = router;
