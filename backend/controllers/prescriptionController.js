const Prescription = require('../models/Prescription');
const Consultation = require('../models/Consultation');
const Appointment = require('../models/Appointment');

// Create or update prescription (called when doctor saves/edits prescription)
const savePrescription = async (req, res) => {
    try {
        console.log('💊 Saving prescription...');
        const { consultationId, medicines, followUp, additionalInstructions, contraindications, doctorNotes } = req.body;
        const doctorId = req.user.userId;

        if (!consultationId) {
            return res.status(400).json({
                success: false,
                error: 'Consultation ID is required'
            });
        }

        // Find consultation and verify doctor authorization
        const consultation = await Consultation.findById(consultationId).populate('appointment');
        if (!consultation) {
            return res.status(404).json({
                success: false,
                error: 'Consultation not found'
            });
        }

        // Verify doctor is authorized
        if (consultation.appointment.doctor.toString() !== doctorId) {
            return res.status(403).json({
                success: false,
                error: 'Only the assigned doctor can create prescriptions'
            });
        }

        const appointmentId = consultation.appointment._id;
        const patientId = consultation.appointment.patient;

        // Calculate end dates for medicines
        const medicinesWithDates = medicines.map(med => ({
            ...med,
            startDate: new Date(),
            endDate: new Date(Date.now() + med.duration_days * 24 * 60 * 60 * 1000),
            isActive: true
        }));

        // Calculate prescription validity (longest medicine duration + 7 days buffer)
        const maxDuration = Math.max(...medicines.map(m => m.duration_days || 0));
        const validUntil = new Date(Date.now() + (maxDuration + 7) * 24 * 60 * 60 * 1000);

        // Create or update prescription
        const prescription = await Prescription.findOneAndUpdate(
            { consultation: consultationId },
            {
                consultation: consultationId,
                appointment: appointmentId,
                patient: patientId,
                doctor: doctorId,
                medicines: medicinesWithDates,
                followUp: followUp || {},
                additionalInstructions: additionalInstructions || [],
                contraindications: contraindications || [],
                doctorNotes: doctorNotes || '',
                status: 'active',
                validUntil
            },
            { new: true, upsert: true }
        ).populate('doctor', 'name specialization profilePicture')
            .populate('patient', 'name email phone');

        console.log('✅ Prescription saved:', prescription._id);

        res.status(201).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        console.error('❌ Error saving prescription:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to save prescription',
            details: error.message
        });
    }
};

// Get prescription by ID
const getPrescription = async (req, res) => {
    try {
        const { id } = req.params;

        const prescription = await Prescription.findById(id)
            .populate('doctor', 'name specialization profilePicture')
            .populate('patient', 'name email phone')
            .populate('appointment', 'appointmentDate consultationMode');

        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }

        res.status(200).json({
            success: true,
            data: prescription
        });
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch prescription',
            details: error.message
        });
    }
};

// Get patient's prescriptions
const getPatientPrescriptions = async (req, res) => {
    try {
        const patientId = req.params.patientId || req.user.userId;
        const { status } = req.query;

        const query = { patient: patientId };
        if (status) {
            query.status = status;
        }

        const prescriptions = await Prescription.find(query)
            .populate('doctor', 'name specialization profilePicture')
            .populate('appointment', 'appointmentDate consultationMode')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: prescriptions.length,
            data: prescriptions
        });
    } catch (error) {
        console.error('Error fetching patient prescriptions:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch prescriptions',
            details: error.message
        });
    }
};

// Get active medicines for a patient (for medications page)
const getActiveMedicines = async (req, res) => {
    try {
        const patientId = req.user.userId;

        const prescriptions = await Prescription.getPatientActivePrescriptions(patientId);

        // Flatten all active medicines from all prescriptions
        const allMedicines = [];
        prescriptions.forEach(prescription => {
            const activeMeds = prescription.getActiveMedicines();
            activeMeds.forEach(med => {
                allMedicines.push({
                    ...med.toObject(),
                    prescriptionId: prescription._id,
                    doctor: prescription.doctor,
                    prescribedDate: prescription.createdAt,
                    appointmentDate: prescription.appointment?.appointmentDate
                });
            });
        });

        res.status(200).json({
            success: true,
            count: allMedicines.length,
            data: allMedicines
        });
    } catch (error) {
        console.error('Error fetching active medicines:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch active medicines',
            details: error.message
        });
    }
};

// Mark prescription as viewed by patient
const markPrescriptionViewed = async (req, res) => {
    try {
        const { id } = req.params;
        const patientId = req.user.userId;

        const prescription = await Prescription.findById(id);
        if (!prescription) {
            return res.status(404).json({
                success: false,
                error: 'Prescription not found'
            });
        }

        // Verify patient owns this prescription
        if (prescription.patient.toString() !== patientId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized access'
            });
        }

        await prescription.markAsViewed();

        res.status(200).json({
            success: true,
            message: 'Prescription marked as viewed'
        });
    } catch (error) {
        console.error('Error marking prescription as viewed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update prescription',
            details: error.message
        });
    }
};

module.exports = {
    savePrescription,
    getPrescription,
    getPatientPrescriptions,
    getActiveMedicines,
    markPrescriptionViewed
};
