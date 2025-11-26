const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const User = require('../models/User');
const DoctorOnboarding = require('../models/DoctorOnboarding');

// Create new appointment (Patient books appointment)
exports.createAppointment = async (req, res) => {
    try {
        const {
            doctorId,
            appointmentDate,
            timeSlot,
            consultationMode,
            reasonForVisit,
            symptoms,
            payment
        } = req.body;

        const patientId = req.user.userId; // From auth middleware

        // Validate required fields
        if (!doctorId || !appointmentDate || !timeSlot || !consultationMode || !reasonForVisit) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Verify doctor exists and is approved
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor' || !doctor.isApproved) {
            return res.status(404).json({
                success: false,
                error: 'Doctor not found or not approved'
            });
        }

        // Get doctor's consultation fee
        const doctorProfile = await DoctorOnboarding.findOne({ userId: doctorId });
        if (!doctorProfile) {
            return res.status(404).json({
                success: false,
                error: 'Doctor profile not found'
            });
        }

        // Calculate fees
        const doctorFee = doctorProfile.consultationFee.amount;
        const platformFee = Math.round(doctorFee * 0.10); // 10% platform fee
        const totalAmount = doctorFee + platformFee;

        // Create appointment
        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            appointmentDate,
            timeSlot,
            consultationMode,
            reasonForVisit,
            symptoms: symptoms || '',
            payment: {
                doctorFee,
                platformFee,
                totalAmount,
                currency: doctorProfile.consultationFee.currency,
                paymentStatus: payment?.paymentStatus || 'completed', // Mock payment
                paymentId: payment?.paymentId || `MOCK_${Date.now()}`,
                paymentMethod: payment?.paymentMethod || 'mock_payment',
                paidAt: new Date()
            },
            status: 'pending'
        });

        // Add initial status to history
        appointment.statusHistory.push({
            status: 'pending',
            changedBy: patientId,
            changedAt: new Date(),
            notes: 'Appointment created'
        });

        await appointment.save();

        // Get patient details for notification
        const patient = await User.findById(patientId);

        // Create notification for doctor
        await Notification.createAppointmentNotification(
            doctorId,
            'appointment_booked',
            appointment._id,
            {
                patientName: patient.name,
                appointmentDate: new Date(appointmentDate).toLocaleDateString(),
                actionUrl: `/doctor-dashboard/appointment-requests`
            }
        );

        // Populate appointment details for response
        const populatedAppointment = await Appointment.findById(appointment._id)
            .populate('patient', 'name email phone profilePicture')
            .populate('doctor', 'name email phone profilePicture');

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            data: populatedAppointment
        });

    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create appointment',
            details: error.message
        });
    }
};

// Get patient appointments
exports.getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user.userId;
        const { status, startDate, endDate } = req.query;

        // Build query
        const query = { patient: patientId };
        if (status) {
            query.status = status;
        }
        if (startDate || endDate) {
            query.appointmentDate = {};
            if (startDate) query.appointmentDate.$gte = new Date(startDate);
            if (endDate) query.appointmentDate.$lte = new Date(endDate);
        }

        const appointments = await Appointment.find(query)
            .populate('doctor', 'name email phone profilePicture')
            .sort({ appointmentDate: -1 });

        // Get doctor onboarding details for each appointment
        const appointmentsWithDetails = await Promise.all(
            appointments.map(async (appointment) => {
                const doctorProfile = await DoctorOnboarding.findOne({ userId: appointment.doctor._id });
                return {
                    ...appointment.toObject(),
                    doctorProfile: doctorProfile ? {
                        specialties: doctorProfile.specialties,
                        languages: doctorProfile.languages,
                        shortBio: doctorProfile.shortBio
                    } : null
                };
            })
        );

        res.status(200).json({
            success: true,
            count: appointmentsWithDetails.length,
            data: appointmentsWithDetails
        });

    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch appointments',
            details: error.message
        });
    }
};

// Get doctor appointments
exports.getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.params.doctorId || req.user.userId;
        const { status, startDate, endDate } = req.query;

        // Build query
        const query = { doctor: doctorId };
        if (status) {
            query.status = status;
        }
        if (startDate || endDate) {
            query.appointmentDate = {};
            if (startDate) query.appointmentDate.$gte = new Date(startDate);
            if (endDate) query.appointmentDate.$lte = new Date(endDate);
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone profilePicture dateOfBirth gender')
            .sort({ appointmentDate: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });

    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch appointments',
            details: error.message
        });
    }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findById(id)
            .populate('patient', 'name email phone profilePicture dateOfBirth gender')
            .populate('doctor', 'name email phone profilePicture');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        // Get doctor profile details
        const doctorProfile = await DoctorOnboarding.findOne({ userId: appointment.doctor._id });

        res.status(200).json({
            success: true,
            data: {
                ...appointment.toObject(),
                doctorProfile: doctorProfile ? {
                    specialties: doctorProfile.specialties,
                    languages: doctorProfile.languages,
                    shortBio: doctorProfile.shortBio,
                    consultationFee: doctorProfile.consultationFee
                } : null
            }
        });

    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch appointment',
            details: error.message
        });
    }
};

// Update appointment status (Approve/Reject/Cancel)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes, reason } = req.body;
        const userId = req.user.userId;

        const appointment = await Appointment.findById(id)
            .populate('patient', 'name email')
            .populate('doctor', 'name email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        // Validate status transition
        const validTransitions = {
            pending: ['confirmed', 'rejected', 'cancelled'],
            confirmed: ['completed', 'cancelled'],
            rejected: [],
            cancelled: [],
            completed: []
        };

        if (!validTransitions[appointment.status].includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot change status from ${appointment.status} to ${status}`
            });
        }

        // Update status using the model method
        appointment.updateStatus(status, userId, notes || '');

        // Handle specific status changes
        if (status === 'rejected') {
            appointment.rejectionReason = reason || notes || '';
        } else if (status === 'cancelled') {
            appointment.cancellationReason = reason || notes || '';
            appointment.cancelledBy = req.user.role; // 'patient', 'doctor', or 'admin'
        }

        await appointment.save();

        // Create notifications based on status
        let notificationType = '';
        let recipientId = null;
        let notificationData = {};

        if (status === 'confirmed') {
            notificationType = 'appointment_confirmed';
            recipientId = appointment.patient._id;
            notificationData = {
                doctorName: appointment.doctor.name,
                appointmentDate: new Date(appointment.appointmentDate).toLocaleDateString(),
                actionUrl: `/patient-dashboard/upcoming-appointments`
            };
        } else if (status === 'rejected') {
            notificationType = 'appointment_rejected';
            recipientId = appointment.patient._id;
            notificationData = {
                reason: appointment.rejectionReason,
                actionUrl: `/patient-dashboard/my-appointments`
            };
        } else if (status === 'cancelled') {
            notificationType = 'appointment_cancelled';
            // Notify the other party
            recipientId = userId === appointment.patient._id.toString()
                ? appointment.doctor._id
                : appointment.patient._id;
            notificationData = {
                reason: appointment.cancellationReason,
                actionUrl: req.user.role === 'doctor'
                    ? `/doctor-dashboard/appointment-history`
                    : `/patient-dashboard/my-appointments`
            };
        } else if (status === 'completed') {
            notificationType = 'appointment_completed';
            recipientId = appointment.patient._id;
            notificationData = {
                doctorName: appointment.doctor.name,
                actionUrl: `/patient-dashboard/past-appointments`
            };
        }

        if (notificationType && recipientId) {
            await Notification.createAppointmentNotification(
                recipientId,
                notificationType,
                appointment._id,
                notificationData
            );
        }

        res.status(200).json({
            success: true,
            message: `Appointment ${status} successfully`,
            data: appointment
        });

    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update appointment status',
            details: error.message
        });
    }
};

// Complete appointment
exports.completeAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorNotes, prescriptionUrl } = req.body;
        const userId = req.user.userId;

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        if (appointment.status !== 'confirmed') {
            return res.status(400).json({
                success: false,
                error: 'Only confirmed appointments can be completed'
            });
        }

        // Update appointment
        appointment.updateStatus('completed', userId, 'Appointment completed');
        appointment.doctorNotes = doctorNotes || '';
        appointment.prescriptionUrl = prescriptionUrl || '';

        if (appointment.videoCallStartedAt && !appointment.videoCallEndedAt) {
            appointment.videoCallEndedAt = new Date();
        }

        await appointment.save();

        // Notify patient
        await Notification.createAppointmentNotification(
            appointment.patient,
            'appointment_completed',
            appointment._id,
            {
                actionUrl: `/patient-dashboard/past-appointments`
            }
        );

        res.status(200).json({
            success: true,
            message: 'Appointment completed successfully',
            data: appointment
        });

    } catch (error) {
        console.error('Error completing appointment:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to complete appointment',
            details: error.message
        });
    }
};

// Get appointment statistics (for dashboard)
exports.getAppointmentStats = async (req, res) => {
    try {
        const userId = req.user.userId;
        const userRole = req.user.role;

        const query = userRole === 'doctor' ? { doctor: userId } : { patient: userId };

        const stats = await Appointment.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
            rejected: 0
        };

        stats.forEach(stat => {
            formattedStats[stat._id] = stat.count;
            formattedStats.total += stat.count;
        });

        res.status(200).json({
            success: true,
            data: formattedStats
        });

    } catch (error) {
        console.error('Error fetching appointment stats:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch appointment statistics',
            details: error.message
        });
    }
};

module.exports = exports;
