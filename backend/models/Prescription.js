const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    // Reference to consultation
    consultation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultation',
        required: true
    },
    // Reference to appointment
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    // Patient who receives the prescription
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Doctor who prescribed
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Prescription details
    medicines: [{
        name: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            morning: { type: Boolean, default: false },
            afternoon: { type: Boolean, default: false },
            night: { type: Boolean, default: false }
        },
        duration_days: {
            type: Number,
            required: true
        },
        instructions: {
            type: String,
            default: ''
        },
        warnings: {
            type: String,
            default: ''
        },
        // Track if medicine is currently active
        isActive: {
            type: Boolean,
            default: true
        },
        // Start and end dates for the medicine
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        }
    }],
    // Follow-up information
    followUp: {
        date: Date,
        notes: String
    },
    // Additional instructions from doctor
    additionalInstructions: [String],
    // Contraindications and warnings
    contraindications: [String],
    // Status of prescription
    status: {
        type: String,
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
    },
    // Prescription validity
    validFrom: {
        type: Date,
        default: Date.now
    },
    validUntil: {
        type: Date
    },
    // Notes from doctor
    doctorNotes: String,
    // Track if prescription has been viewed by patient
    viewedByPatient: {
        type: Boolean,
        default: false
    },
    viewedAt: Date
}, {
    timestamps: true
});

// Index for efficient queries
prescriptionSchema.index({ patient: 1, status: 1, createdAt: -1 });
prescriptionSchema.index({ appointment: 1 });
prescriptionSchema.index({ consultation: 1 });

// Virtual for checking if prescription is still valid
prescriptionSchema.virtual('isValid').get(function () {
    if (!this.validUntil) return true;
    return new Date() <= this.validUntil;
});

// Method to mark prescription as viewed
prescriptionSchema.methods.markAsViewed = function () {
    this.viewedByPatient = true;
    this.viewedAt = new Date();
    return this.save();
};

// Method to get active medicines
prescriptionSchema.methods.getActiveMedicines = function () {
    return this.medicines.filter(med => {
        if (!med.isActive) return false;
        if (!med.endDate) return true;
        return new Date() <= med.endDate;
    });
};

// Static method to get patient's active prescriptions
prescriptionSchema.statics.getPatientActivePrescriptions = function (patientId) {
    return this.find({
        patient: patientId,
        status: 'active'
    })
        .populate('doctor', 'name specialization profilePicture')
        .populate('appointment', 'appointmentDate')
        .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Prescription', prescriptionSchema);
