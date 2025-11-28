const mongoose = require('mongoose');

const doctorOnboardingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },


    // Step 1: Basic Information
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },

    // Step 1: Medical Registration
    medicalRegistrationNumber: {
        type: String,
        trim: true,
        sparse: true  // Allows null/undefined but enforces uniqueness when present
    },
    registrationCouncil: {
        type: String,
        trim: true,
        default: ''
    },

    // Step 2: Professional Details
    specialties: {
        type: [String],
        default: []
    },

    consultationModes: {
        type: [String],
        enum: {
            values: ['tele', 'in_person'],
            message: '{VALUE} is not a valid consultation mode'
        },
        default: []
    },

    languages: {
        type: [String],
        default: []
    },

    // Step 2: Profile
    profilePhoto: {
        type: String,
        default: ''
    },

    shortBio: {
        type: String,
        default: ''
    },

    // Step 2: Clinic/Practice Location
    clinicLocation: {
        address: {
            type: String,
            default: ''
        },
        city: {
            type: String,
            default: ''
        },
        state: {
            type: String,
            default: ''
        },
        country: {
            type: String,
            default: 'India'
        },
        zipCode: {
            type: String,
            default: ''
        },
        coordinates: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                default: [0, 0]
            }
        }
    },

    // Step 3: Availability Schedule
    availability: {
        type: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            slots: [{
                startTime: String,
                endTime: String,
                isAvailable: {
                    type: Boolean,
                    default: true
                }
            }]
        }],
        default: []
    },

    // Step 3: Consultation Fee
    consultationFee: {
        currency: {
            type: String,
            default: 'INR'
        },
        amount: {
            type: Number,
            default: 0,
            min: [0, 'Fee cannot be negative']
        },
        mode: {
            type: String,
            enum: ['per_consult', 'per_minute'],
            default: 'per_consult'
        }
    },

    // Step 4: Verification Documents
    verificationDocuments: {
        type: [String],
        default: []
    },

    // Step 4: Terms and Conditions
    termsAndConditionsSigned: {
        type: Boolean,
        default: false
    },

    // Verification Status (Mock for MVP)
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    verificationNotes: {
        type: String,
        default: ''
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

// Add index for medical registration number
doctorOnboardingSchema.index({ medicalRegistrationNumber: 1 }, { unique: true, sparse: true });

// Add geospatial index for location-based queries
doctorOnboardingSchema.index({ 'clinicLocation.coordinates': '2dsphere' });


// Method to check if onboarding is complete
doctorOnboardingSchema.methods.checkOnboardingComplete = function () {
    const progress = this.onboardingProgress;
    if (progress.step1Completed && progress.step2Completed &&
        progress.step3Completed && progress.step4Completed) {
        this.onboardingProgress.isCompleted = true;
        this.onboardingProgress.completedAt = new Date();
    }
};

// Method to auto-verify for MVP (mock verification)
doctorOnboardingSchema.methods.autoVerifyForMVP = function () {
    // For MVP, auto-verify doctors after onboarding completion
    if (this.onboardingProgress.isCompleted && this.verificationStatus === 'pending') {
        this.verificationStatus = 'verified';
        this.verificationNotes = 'Auto-verified for MVP';
    }
};

const DoctorOnboarding = mongoose.model('DoctorOnboarding', doctorOnboardingSchema);

module.exports = DoctorOnboarding;
