const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    // Patient and Doctor References
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Patient reference is required']
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Doctor reference is required']
    },

    // Appointment Details
    appointmentDate: {
        type: Date,
        required: [true, 'Appointment date is required']
    },
    timeSlot: {
        startTime: {
            type: String,
            required: [true, 'Start time is required']
        },
        endTime: {
            type: String,
            required: [true, 'End time is required']
        }
    },
    consultationMode: {
        type: String,
        enum: ['tele', 'in_person'],
        required: [true, 'Consultation mode is required']
    },
    reasonForVisit: {
        type: String,
        required: [true, 'Reason for visit is required'],
        trim: true
    },
    symptoms: {
        type: String,
        trim: true,
        default: ''
    },
    preDiagnosisReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report',
        default: null
    },

    // Status Management
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed']
        },
        changedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],

    // Rejection/Cancellation Details
    rejectionReason: {
        type: String,
        default: ''
    },
    cancellationReason: {
        type: String,
        default: ''
    },
    cancelledBy: {
        type: String,
        enum: ['patient', 'doctor', 'admin', ''],
        default: ''
    },

    // Payment Information
    payment: {
        doctorFee: {
            type: Number,
            required: [true, 'Doctor fee is required']
        },
        platformFee: {
            type: Number,
            required: [true, 'Platform fee is required']
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required']
        },
        currency: {
            type: String,
            default: 'INR'
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentId: {
            type: String,
            default: ''
        },
        paymentMethod: {
            type: String,
            default: ''
        },
        paidAt: {
            type: Date
        }
    },

    // Video Call Information
    videoCallEnabled: {
        type: Boolean,
        default: false
    },
    videoCallLink: {
        type: String,
        default: ''
    },
    videoCallStartedAt: {
        type: Date
    },
    videoCallEndedAt: {
        type: Date
    },
    meetCode: {
        type: String,
        default: '',
        sparse: true  // Allows multiple empty values, unique only when set
    },
    meetCodeGeneratedAt: {
        type: Date
    },

    // Appointment Notes
    doctorNotes: {
        type: String,
        default: ''
    },
    prescriptionUrl: {
        type: String,
        default: ''
    },

    // Timestamps
    confirmedAt: {
        type: Date
    },
    completedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
appointmentSchema.index({ patient: 1, appointmentDate: -1 });
appointmentSchema.index({ doctor: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });

// Method to calculate platform fee (10% of doctor fee)
appointmentSchema.methods.calculatePlatformFee = function () {
    return Math.round(this.payment.doctorFee * 0.10);
};

// Method to update status with history tracking
appointmentSchema.methods.updateStatus = function (newStatus, userId, notes = '') {
    this.status = newStatus;
    this.statusHistory.push({
        status: newStatus,
        changedBy: userId,
        changedAt: new Date(),
        notes: notes
    });

    // Update specific timestamps based on status
    if (newStatus === 'confirmed') {
        this.confirmedAt = new Date();
        this.videoCallEnabled = this.consultationMode === 'tele';

        // Generate unique meet code for tele consultations
        if (this.consultationMode === 'tele' && !this.meetCode) {
            this.meetCode = this.generateMeetCode();
            this.meetCodeGeneratedAt = new Date();
        }
    } else if (newStatus === 'completed') {
        this.completedAt = new Date();
    }
};

// Method to generate unique meet code
appointmentSchema.methods.generateMeetCode = function () {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Format as XXX-XXX-XX
    return `${code.slice(0, 3)}-${code.slice(3, 6)}-${code.slice(6, 8)}`;
};

// Virtual for appointment duration
appointmentSchema.virtual('duration').get(function () {
    if (this.videoCallStartedAt && this.videoCallEndedAt) {
        return Math.round((this.videoCallEndedAt - this.videoCallStartedAt) / 60000); // in minutes
    }
    return 0;
});

// Pre-save middleware to update timestamps
appointmentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
