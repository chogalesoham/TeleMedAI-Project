const Notification = require('../models/Notification');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;
        const { limit = 50, skip = 0, unreadOnly = false } = req.query;

        // Build query
        const query = { recipient: userId };
        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .populate('relatedAppointment', 'appointmentDate timeSlot status')
            .populate('relatedUser', 'name profilePicture')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const unreadCount = await Notification.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            count: notifications.length,
            unreadCount,
            data: notifications
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch notifications',
            details: error.message
        });
    }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        await notification.markAsRead();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark notification as read',
            details: error.message
        });
    }
};

// Mark all notifications as read for a user
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;

        const result = await Notification.updateMany(
            { recipient: userId, isRead: false },
            {
                $set: {
                    isRead: true,
                    readAt: new Date()
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            data: {
                modifiedCount: result.modifiedCount
            }
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to mark all notifications as read',
            details: error.message
        });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete notification',
            details: error.message
        });
    }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.userId;

        const count = await Notification.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: {
                unreadCount: count
            }
        });

    } catch (error) {
        console.error('Error fetching unread count:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch unread count',
            details: error.message
        });
    }
};

module.exports = exports;
