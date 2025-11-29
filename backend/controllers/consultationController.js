const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');

// Save consultation result
const saveConsultation = async (req, res) => {
    try {
        console.log('💾 Saving consultation...');
        console.log('📦 Request body keys:', Object.keys(req.body));
        console.log('🆔 Appointment ID:', req.body.appointmentId);

        const { appointmentId, transcription, summary, prescription } = req.body;

        if (!appointmentId) {
            console.error('❌ Missing appointmentId');
            return res.status(400).json({
                success: false,
                error: 'Appointment ID is required'
            });
        }

        // Check if appointment exists
        console.log('🔍 Looking for appointment:', appointmentId);
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            console.error('❌ Appointment not found:', appointmentId);
            return res.status(404).json({
                success: false,
                error: 'Appointment not found'
            });
        }

        console.log('✅ Appointment found, creating/updating consultation...');
        // Create or update consultation
        const consultation = await Consultation.findOneAndUpdate(
            { appointment: appointmentId },
            {
                transcription,
                summary,
                prescription
            },
            { new: true, upsert: true }
        );

        console.log('✅ Consultation saved:', consultation._id);

        // Update appointment status to completed if not already
        if (appointment.status !== 'completed') {
            appointment.status = 'completed';
            appointment.completedAt = new Date();
            await appointment.save();
            console.log('✅ Appointment marked as completed');
        }

        res.status(201).json({
            success: true,
            data: consultation
        });
    } catch (error) {
        console.error('❌ Error saving consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save consultation result',
            details: error.message
        });
    }
};

// Get consultation by ID (or Appointment ID)
const getConsultation = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to find by Consultation ID first
        let consultation = await Consultation.findById(id).populate({
            path: 'appointment',
            populate: [
                { path: 'patient', select: 'name email' },
                { path: 'doctor', select: 'name specialization' }
            ]
        });

        // If not found, try to find by Appointment ID
        if (!consultation) {
            consultation = await Consultation.findOne({ appointment: id }).populate({
                path: 'appointment',
                populate: [
                    { path: 'patient', select: 'name email' },
                    { path: 'doctor', select: 'name specialization' }
                ]
            });
        }

        if (!consultation) {
            return res.status(404).json({
                success: false,
                error: 'Consultation record not found'
            });
        }

        res.status(200).json({
            success: true,
            data: consultation
        });
    } catch (error) {
        console.error('Error fetching consultation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch consultation record'
        });
    }
};

// Update prescription (Doctor only)
const updatePrescription = async (req, res) => {
    try {
        console.log('📝 Updating prescription...');
        const { id } = req.params;
        const { prescription } = req.body;
        const userId = req.user.userId;

        if (!prescription) {
            console.error('❌ Missing prescription data');
            return res.status(400).json({
                success: false,
                error: 'Prescription data is required'
            });
        }

        // Find consultation and populate appointment to check doctor
        console.log('🔍 Looking for consultation:', id);
        const consultation = await Consultation.findById(id).populate('appointment');

        if (!consultation) {
            console.error('❌ Consultation not found:', id);
            return res.status(404).json({
                success: false,
                error: 'Consultation not found'
            });
        }

        // Verify the user is the doctor for this consultation
        if (consultation.appointment.doctor.toString() !== userId) {
            console.error('❌ Unauthorized: User is not the doctor for this consultation');
            return res.status(403).json({
                success: false,
                error: 'Only the assigned doctor can update the prescription'
            });
        }

        console.log('✅ Authorization verified, updating prescription...');

        // Update prescription
        consultation.prescription = prescription;
        consultation.updatedAt = new Date();
        await consultation.save();

        console.log('✅ Prescription updated successfully');

        res.status(200).json({
            success: true,
            data: consultation
        });
    } catch (error) {
        console.error('❌ Error updating prescription:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update prescription',
            details: error.message
        });
    }
};

module.exports = {
    saveConsultation,
    getConsultation,
    updatePrescription
};
