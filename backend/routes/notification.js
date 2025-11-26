const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get notifications
router.get('/:userId', notificationController.getUserNotifications);
router.get('/:userId/unread-count', notificationController.getUnreadCount);

// Mark as read
router.patch('/:id/read', notificationController.markAsRead);
router.patch('/user/:userId/read-all', notificationController.markAllAsRead);

// Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
