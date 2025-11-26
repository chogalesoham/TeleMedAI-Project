import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Notification {
    _id: string;
    recipient: string;
    type:
    | 'appointment_booked'
    | 'appointment_confirmed'
    | 'appointment_rejected'
    | 'appointment_cancelled'
    | 'appointment_completed'
    | 'appointment_reminder'
    | 'payment_success'
    | 'payment_failed'
    | 'general';
    title: string;
    message: string;
    relatedAppointment?: {
        _id: string;
        appointmentDate: Date;
        timeSlot: {
            startTime: string;
            endTime: string;
        };
        status: string;
    };
    relatedUser?: {
        _id: string;
        name: string;
        profilePicture?: string;
    };
    isRead: boolean;
    readAt?: Date;
    priority: 'low' | 'medium' | 'high';
    actionUrl?: string;
    metadata?: Record<string, string>;
    createdAt: Date;
}

class NotificationService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };
    }

    // Get user notifications
    async getUserNotifications(
        userId: string,
        options?: {
            limit?: number;
            skip?: number;
            unreadOnly?: boolean;
        }
    ) {
        try {
            const params = {
                limit: options?.limit || 50,
                skip: options?.skip || 0,
                unreadOnly: options?.unreadOnly || false,
            };

            const response = await axios.get(
                `${API_URL}/notifications/${userId}`,
                {
                    ...this.getAuthHeader(),
                    params,
                }
            );

            return {
                success: true,
                data: response.data.data,
                count: response.data.count,
                unreadCount: response.data.unreadCount,
            };
        } catch (error: any) {
            console.error('Error fetching notifications:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch notifications',
            };
        }
    }

    // Get unread count
    async getUnreadCount(userId: string) {
        try {
            const response = await axios.get(
                `${API_URL}/notifications/${userId}/unread-count`,
                this.getAuthHeader()
            );

            return {
                success: true,
                data: response.data.data.unreadCount,
            };
        } catch (error: any) {
            console.error('Error fetching unread count:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to fetch unread count',
            };
        }
    }

    // Mark notification as read
    async markAsRead(notificationId: string) {
        try {
            const response = await axios.patch(
                `${API_URL}/notifications/${notificationId}/read`,
                {},
                this.getAuthHeader()
            );

            return {
                success: true,
                data: response.data.data,
                message: response.data.message,
            };
        } catch (error: any) {
            console.error('Error marking notification as read:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to mark notification as read',
            };
        }
    }

    // Mark all notifications as read
    async markAllAsRead(userId: string) {
        try {
            const response = await axios.patch(
                `${API_URL}/notifications/user/${userId}/read-all`,
                {},
                this.getAuthHeader()
            );

            return {
                success: true,
                message: response.data.message,
                modifiedCount: response.data.data.modifiedCount,
            };
        } catch (error: any) {
            console.error('Error marking all notifications as read:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to mark all notifications as read',
            };
        }
    }

    // Delete notification
    async deleteNotification(notificationId: string) {
        try {
            const response = await axios.delete(
                `${API_URL}/notifications/${notificationId}`,
                this.getAuthHeader()
            );

            return {
                success: true,
                message: response.data.message,
            };
        } catch (error: any) {
            console.error('Error deleting notification:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to delete notification',
            };
        }
    }
}

export default new NotificationService();
