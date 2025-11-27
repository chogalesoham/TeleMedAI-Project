const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    patientInfo: {
        name: String,
        age: Number,
        gender: String,
        existingDiseases: [String],
        allergies: [String],
        medications: [String],
        vitals: {
            heartRate: String,
            bloodPressure: String,
            temperature: String
        }
    },
    conversationHistory: [{
        role: {
            type: String,
            enum: ['user', 'assistant', 'system'],
            required: true
        },
        content: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    symptoms: [String],
    differentialDiagnoses: [{
        condition: String,
        probability: Number,
        description: String,
        severity: String,
        progress: Number // 0-100 for progress bar
    }],
    tests: [String],
    urgency: {
        level: {
            type: String,
            enum: ['Low', 'Moderate', 'High', 'Critical'],
            default: 'Low'
        },
        description: String
    },
    redFlags: [String],
    medications: [{ // OTC suggestions
        name: String,
        dosage: String,
        purpose: String
    }],
    lifestyleAdvice: [String],
    dietPlan: [String],
    followUpRecommendation: String,
    summary: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Report', ReportSchema);