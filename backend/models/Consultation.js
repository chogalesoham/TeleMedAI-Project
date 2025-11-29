const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true
    },
    transcription: {
        type: String,
        required: true
    },
    summary: {
        doctor_summary: String,
        patient_summary: String,
        key_symptoms: [String],
        diagnosis_discussed: String,
        medications_prescribed: [String],
        follow_up_instructions: [String],
        important_notes: [String]
    },
    prescription: {
        medicines: [{
            name: String,
            dosage: String,
            frequency: mongoose.Schema.Types.Mixed,
            duration_days: Number,
            instructions: String,
            warnings: String
        }],
        follow_up_date: String,
        additional_instructions: [String],
        contraindications: [String]
    },
    audioFileUrl: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Consultation', consultationSchema);
