const mongoose = require('mongoose');

const patientOnboardingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  // Step 1: Basic Health Profile
  basicHealthProfile: {
    height: {
      value: { type: Number },
      unit: { type: String, enum: ['cm', 'ft'], default: 'cm' }
    },
    weight: {
      value: { type: Number },
      unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' }
    },
    bmi: { type: Number },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say']
    },
    dateOfBirth: { type: Date }
  },
  
  // Step 2: Medical History
  medicalHistory: {
    chronicDiseases: [{
      name: String,
      diagnosedYear: Number,
      notes: String
    }],
    previousSurgeries: [{
      name: String,
      year: Number,
      notes: String
    }],
    hospitalizations: [{
      reason: String,
      year: Number,
      duration: String,
      hospital: String
    }],
    familyMedicalHistory: [{
      relation: String,
      condition: String,
      notes: String
    }]
  },
  
  // Step 3: Current Health Status (Lifestyle & Health)
  currentHealthStatus: {
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date,
      prescribedBy: String
    }],
    allergies: [{
      allergen: String,
      reaction: String,
      severity: { type: String, enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening'] }
    }],
    smokingStatus: {
      type: String,
      enum: ['Never', 'Former', 'Current']
    },
    smokingDetails: {
      cigarettesPerDay: Number,
      yearsSmoked: Number
    },
    alcoholConsumption: {
      type: String,
      enum: ['Never', 'Occasionally', 'Moderate', 'Heavy']
    },
    alcoholDetails: {
      drinksPerWeek: Number
    },
    exerciseFrequency: {
      type: String,
      enum: ['None', '1-2 times/week', '3-4 times/week', '5+ times/week', 'Daily']
    },
    exerciseType: [String],
    dietType: {
      type: String,
      enum: ['Regular', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Other']
    },
    sleepHours: {
      average: Number,
      quality: { type: String, enum: ['Poor', 'Fair', 'Good', 'Excellent'] }
    },
    ongoingTreatments: [{
      condition: String,
      treatmentType: String,
      provider: String,
      startDate: Date
    }]
  },
  
  // Step 4: Emergency Contacts (formerly Telemedicine Preferences)
  telemedicinePreferences: {
    type: {
      // Emergency Contacts
      emergencyContacts: {
        type: {
          primaryContact: {
            type: {
              name: { type: String },
              relationship: { type: String },
              phone: { type: String },
              alternatePhone: { type: String },
              email: { type: String },
              address: { type: String }
            }
          },
          secondaryContact: {
            type: {
              name: { type: String },
              relationship: { type: String },
              phone: { type: String },
              alternatePhone: { type: String },
              email: { type: String },
              address: { type: String }
            }
          }
        }
      },
      // Legacy fields (keeping for backward compatibility)
      preferredConsultationType: {
        type: [String],
        enum: ['Video', 'Audio', 'Chat']
      },
      preferredConsultationTime: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        timeSlot: { type: String, enum: ['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)'] }
      }],
      notificationPreferences: {
        type: {
          sms: { type: Boolean, default: true },
          email: { type: Boolean, default: true },
          push: { type: Boolean, default: true }
        }
      },
      languagePreference: {
        type: String,
        default: 'English'
      },
      specialistPreferences: [{
        specialty: String,
        priority: Number
      }]
    },
    default: {}
  },
  
  // Onboarding Progress Tracking
  onboardingProgress: {
    step1Completed: { type: Boolean, default: false },
    step2Completed: { type: Boolean, default: false },
    step3Completed: { type: Boolean, default: false },
    step4Completed: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
    currentStep: { type: Number, default: 1 }
  },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Middleware to calculate BMI before saving
patientOnboardingSchema.pre('save', function(next) {
  if (this.basicHealthProfile?.height?.value && this.basicHealthProfile?.weight?.value) {
    let heightInMeters = this.basicHealthProfile.height.value;
    let weightInKg = this.basicHealthProfile.weight.value;
    
    // Convert height to meters if in feet
    if (this.basicHealthProfile.height.unit === 'ft') {
      heightInMeters = heightInMeters * 0.3048;
    } else {
      heightInMeters = heightInMeters / 100; // cm to meters
    }
    
    // Convert weight to kg if in lbs
    if (this.basicHealthProfile.weight.unit === 'lbs') {
      weightInKg = weightInKg * 0.453592;
    }
    
    // Calculate BMI
    this.basicHealthProfile.bmi = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));
  }
  
  next();
});

// Method to check if onboarding is complete
patientOnboardingSchema.methods.checkOnboardingComplete = function() {
  const progress = this.onboardingProgress;
  if (progress.step1Completed && progress.step2Completed && 
      progress.step3Completed && progress.step4Completed) {
    this.onboardingProgress.isCompleted = true;
    this.onboardingProgress.completedAt = new Date();
  }
};

const PatientOnboarding = mongoose.model('PatientOnboarding', patientOnboardingSchema);

module.exports = PatientOnboarding;
