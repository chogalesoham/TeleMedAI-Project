const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    // Recipient
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },

    // Notification Details
    type: {
        type: String,
        enum: [
            'appointment_booked',
            'appointment_confirmed',
            'appointment_rejected',
            'appointment_cancelled',
            'appointment_completed',
            'appointment_reminder',
            'payment_success',
            'payment_failed',
            'general'
        ],
        required: [true, 'Notification type is required']
    },
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true
    },

    // Related Data
    relatedAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    relatedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // Status
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },

    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },

    // Action URL (for navigation)
    actionUrl: {
        type: String,
        default: ''
    },

    // Metadata
    metadata: {
        type: Map,
        of: String,
        default: {}
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Indexes for efficient queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ type: 1 });

// Method to mark as read
notificationSchema.methods.markAsRead = function () {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
};

// Static method to create appointment notification
notificationSchema.statics.createAppointmentNotification = async function (
    recipientId,
    type,
    appointmentId,
    customData = {}
) {
    const notificationTemplates = {
        appointment_booked: {
            title: 'New Appointment Request',
            message: `You have received a new appointment request from ${customData.patientName || 'a patient'}.`,
            priority: 'high'
        },
        appointment_confirmed: {
            title: 'Appointment Confirmed',
            message: `Your appointment with Dr. ${customData.doctorName || 'the doctor'} has been confirmed for ${customData.appointmentDate || 'the scheduled date'}.`,
            priority: 'high'
        },
        appointment_rejected: {
            title: 'Appointment Rejected',
            message: `Your appointment request has been rejected. ${customData.reason || ''}`,
            priority: 'medium'
        },
        appointment_cancelled: {
            title: 'Appointment Cancelled',
            message: `An appointment has been cancelled. ${customData.reason || ''}`,
            priority: 'medium'
        },
        appointment_completed: {
            title: 'Appointment Completed',
            message: `Your appointment with ${customData.doctorName || customData.patientName || 'the provider'} has been completed.`,
            priority: 'low'
        },
        appointment_reminder: {
            title: 'Appointment Reminder',
            message: `Reminder: You have an appointment ${customData.timeInfo || 'soon'}.`,
            priority: 'high'
        },
        payment_success: {
            title: 'Payment Successful',
            message: `Your payment of ${customData.amount || ''} has been processed successfully.`,
            priority: 'medium'
        },
        payment_failed: {
            title: 'Payment Failed',
            message: `Your payment could not be processed. Please try again.`,
            priority: 'high'
        }
    };

    const template = notificationTemplates[type] || {
        title: 'Notification',
        message: customData.message || 'You have a new notification.',
        priority: 'medium'
    };

    const notification = new this({
        recipient: recipientId,
        type: type,
        title: customData.title || template.title,
        message: customData.message || template.message,
        priority: customData.priority || template.priority,
        relatedAppointment: appointmentId,
        relatedUser: customData.relatedUserId,
        actionUrl: customData.actionUrl || '',
        metadata: customData.metadata || {}
    });

    return await notification.save();
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function (userId) {
    return await this.countDocuments({ recipient: userId, isRead: false });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
