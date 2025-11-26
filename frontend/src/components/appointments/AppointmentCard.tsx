import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Video,
    MapPin,
    User,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Ban,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Appointment } from '@/services/appointment.service';
import { format } from 'date-fns';

interface AppointmentCardProps {
    appointment: Appointment;
    userRole: 'patient' | 'doctor';
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    onCancel?: (id: string) => void;
    onComplete?: (id: string) => void;
    onJoinCall?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

const statusConfig = {
    pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: AlertCircle,
        label: 'Pending',
    },
    confirmed: {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Confirmed',
    },
    rejected: {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: XCircle,
        label: 'Rejected',
    },
    cancelled: {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: Ban,
        label: 'Cancelled',
    },
    completed: {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: CheckCircle,
        label: 'Completed',
    },
};

export const AppointmentCard = ({
    appointment,
    userRole,
    onApprove,
    onReject,
    onCancel,
    onComplete,
    onJoinCall,
    onViewDetails,
}: AppointmentCardProps) => {
    const otherUser = userRole === 'patient' ? appointment.doctor : appointment.patient;
    const statusInfo = statusConfig[appointment.status];
    const StatusIcon = statusInfo.icon;

    const formatDate = (date: Date) => {
        return format(new Date(date), 'MMM dd, yyyy');
    };

    const formatTime = (time: string) => {
        return time;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Avatar and User Info */}
                        <div className="flex items-start gap-3 flex-1">
                            <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
                                <AvatarImage src={otherUser.profilePicture} />
                                <AvatarFallback className="text-lg">
                                    {otherUser.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                                            {userRole === 'patient' ? 'Dr. ' : ''}{otherUser.name}
                                        </h3>
                                        {appointment.doctorProfile && userRole === 'patient' && (
                                            <p className="text-sm text-gray-600">
                                                {appointment.doctorProfile.specialties[0]}
                                            </p>
                                        )}
                                    </div>
                                    <Badge className={`${statusInfo.color} border flex items-center gap-1`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {statusInfo.label}
                                    </Badge>
                                </div>

                                {/* Appointment Details */}
                                <div className="space-y-2 mt-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{formatDate(appointment.appointmentDate)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        {appointment.consultationMode === 'tele' ? (
                                            <>
                                                <Video className="w-4 h-4" />
                                                <span>Video Consultation</span>
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="w-4 h-4" />
                                                <span>In-Person Consultation</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                        <FileText className="w-4 h-4 mt-0.5" />
                                        <span className="line-clamp-2">{appointment.reasonForVisit}</span>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Total Amount:</span>
                                        <span className="font-semibold text-gray-900">
                                            {appointment.payment.currency} {appointment.payment.totalAmount}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                        <span>Payment Status:</span>
                                        <span className="capitalize">{appointment.payment.paymentStatus}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-col gap-2 justify-end">
                            {/* Doctor Actions */}
                            {userRole === 'doctor' && appointment.status === 'pending' && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => onApprove?.(appointment._id)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onReject?.(appointment._id)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <XCircle className="w-4 h-4 mr-1" />
                                        Reject
                                    </Button>
                                </>
                            )}

                            {userRole === 'doctor' && appointment.status === 'confirmed' && (
                                <>
                                    {appointment.videoCallEnabled && (
                                        <Button
                                            size="sm"
                                            onClick={() => onJoinCall?.(appointment._id)}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <Video className="w-4 h-4 mr-1" />
                                            Start Call
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onComplete?.(appointment._id)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        Complete
                                    </Button>
                                </>
                            )}

                            {/* Patient Actions */}
                            {userRole === 'patient' && appointment.status === 'confirmed' && appointment.videoCallEnabled && (
                                <Button
                                    size="sm"
                                    onClick={() => onJoinCall?.(appointment._id)}
                                    className="flex-1 sm:flex-none"
                                >
                                    <Video className="w-4 h-4 mr-1" />
                                    Join Call
                                </Button>
                            )}

                            {/* Common Actions */}
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCancel?.(appointment._id)}
                                    className="flex-1 sm:flex-none"
                                >
                                    <Ban className="w-4 h-4 mr-1" />
                                    Cancel
                                </Button>
                            )}

                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onViewDetails?.(appointment._id)}
                                className="flex-1 sm:flex-none"
                            >
                                View Details
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AppointmentCard;
