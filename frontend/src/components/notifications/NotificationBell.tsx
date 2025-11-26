import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import NotificationService, { Notification } from '@/services/notification.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface NotificationBellProps {
    userId: string;
}

export const NotificationBell = ({ userId }: NotificationBellProps) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (userId) {
            fetchNotifications();
            fetchUnreadCount();

            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                fetchUnreadCount();
            }, 30000);

            return () => clearInterval(interval);
        }
    }, [userId]);

    const fetchNotifications = async () => {
        setIsLoading(true);
        const response = await NotificationService.getUserNotifications(userId, {
            limit: 20,
        });

        if (response.success && response.data) {
            setNotifications(response.data);
            setUnreadCount(response.unreadCount || 0);
        }
        setIsLoading(false);
    };

    const fetchUnreadCount = async () => {
        const response = await NotificationService.getUnreadCount(userId);
        if (response.success) {
            setUnreadCount(response.data || 0);
        }
    };

    const handleMarkAsRead = async (notificationId: string) => {
        const response = await NotificationService.markAsRead(notificationId);
        if (response.success) {
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const handleMarkAllAsRead = async () => {
        const response = await NotificationService.markAllAsRead(userId);
        if (response.success) {
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
            toast.success('All notifications marked as read');
        }
    };

    const handleDeleteNotification = async (notificationId: string) => {
        const response = await NotificationService.deleteNotification(notificationId);
        if (response.success) {
            setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            toast.success('Notification deleted');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification._id);
        }

        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            setIsOpen(false);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 border-red-300';
            case 'medium':
                return 'bg-yellow-100 border-yellow-300';
            case 'low':
                return 'bg-blue-100 border-blue-300';
            default:
                return 'bg-gray-100 border-gray-300';
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="text-xs"
                        >
                            <Check className="w-3 h-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No notifications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            <AnimatePresence>
                                {notifications.map((notification, index) => (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.isRead ? 'bg-blue-50/50' : ''
                                            }`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.isRead ? 'bg-blue-600' : 'bg-gray-300'
                                                    }`}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                                                        {notification.title}
                                                    </h4>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 flex-shrink-0"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteNotification(notification._id);
                                                        }}
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-xs text-gray-500">
                                                        {format(new Date(notification.createdAt), 'MMM dd, h:mm a')}
                                                    </span>
                                                    {notification.priority === 'high' && (
                                                        <Badge variant="destructive" className="text-xs px-1 py-0">
                                                            Urgent
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
