const mongoose = require('mongoose');

const PreDiagnosisSchema = new mongoose.Schema({
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
  initialProblem: {
    symptoms: [String],
    description: String,
    duration: String,
    severity: String
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
  allEntities: [{
    entity: String,
    category: String,
    confidence: Number
  }],
  finalSummary: {
    possibleConditions: [{
      condition: String,
      probability: String,
      description: String,
      severity: String
    }],
    recommendations: [String],
    summaryText: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PreDiagnosis', PreDiagnosisSchema);
