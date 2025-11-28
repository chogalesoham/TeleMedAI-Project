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
    DollarSign,
    Stethoscope,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        icon: AlertCircle,
        label: 'Pending',
        dotColor: 'bg-yellow-500',
    },
    confirmed: {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: CheckCircle,
        label: 'Confirmed',
        dotColor: 'bg-green-500',
    },
    rejected: {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: XCircle,
        label: 'Rejected',
        dotColor: 'bg-red-500',
    },
    cancelled: {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: Ban,
        label: 'Cancelled',
        dotColor: 'bg-gray-500',
    },
    completed: {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: CheckCircle,
        label: 'Completed',
        dotColor: 'bg-blue-500',
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
        return format(new Date(date), 'EEE, MMM dd, yyyy');
    };

    const formatTime = (time: string) => {
        return time;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -4 }}
        >
            <Card className="overflow-hidden border-l-4 hover:shadow-xl transition-all duration-300"
                style={{ borderLeftColor: statusInfo.dotColor.replace('bg-', '#').replace('500', '600') }}>
                <CardContent className="p-0">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-5 border-b">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className="w-14 h-14 sm:w-16 sm:h-16 ring-2 ring-white shadow-md">
                                    <AvatarImage src={otherUser.profilePicture} />
                                    <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                        {otherUser.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg sm:text-xl text-gray-900 truncate">
                                        {userRole === 'patient' ? 'Dr. ' : ''}{otherUser.name}
                                    </h3>
                                    {appointment.doctorProfile && userRole === 'patient' && (
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <Stethoscope className="w-3.5 h-3.5 text-gray-500" />
                                            <p className="text-sm text-gray-600 truncate">
                                                {appointment.doctorProfile.specialties[0]}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Badge className={`${statusInfo.color} border-2 flex items-center gap-1.5 px-3 py-1 font-semibold`}>
                                <div className={`w-2 h-2 rounded-full ${statusInfo.dotColor} animate-pulse`}></div>
                                {statusInfo.label}
                            </Badge>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-4 sm:p-5 space-y-4">
                        {/* Appointment Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="rounded-full bg-blue-100 p-2">
                                    <Calendar className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Date</p>
                                    <p className="text-sm font-semibold text-gray-900">{formatDate(appointment.appointmentDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="rounded-full bg-purple-100 p-2">
                                    <Clock className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Time</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {formatTime(appointment.timeSlot.startTime)} - {formatTime(appointment.timeSlot.endTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className={`rounded-full ${appointment.consultationMode === 'tele' ? 'bg-green-100' : 'bg-orange-100'} p-2`}>
                                    {appointment.consultationMode === 'tele' ? (
                                        <Video className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Mode</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {appointment.consultationMode === 'tele' ? 'Video Call' : 'In-Person'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="rounded-full bg-emerald-100 p-2">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Amount</p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {appointment.payment.currency} {appointment.payment.totalAmount}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Reason for Visit */}
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-xs text-blue-600 font-semibold mb-1">Reason for Visit</p>
                                    <p className="text-sm text-gray-700">{appointment.reasonForVisit}</p>
                                </div>
                            </div>
                        </div>

                        {/* Meet Code Display */}
                        {appointment.status === 'confirmed' && appointment.meetCode && (
                            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Video className="w-5 h-5 text-indigo-600" />
                                        <span className="text-sm font-semibold text-indigo-700">Meet Code:</span>
                                    </div>
                                    <code className="text-lg font-mono font-bold text-indigo-900 tracking-widest bg-white px-3 py-1 rounded border border-indigo-300">
                                        {appointment.meetCode}
                                    </code>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 sm:p-5 bg-gray-50 border-t">
                        <div className="flex flex-wrap gap-2">
                            {/* Doctor Actions */}
                            {userRole === 'doctor' && appointment.status === 'pending' && (
                                <>
                                    <Button
                                        size="sm"
                                        onClick={() => onApprove?.(appointment._id)}
                                        className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => onReject?.(appointment._id)}
                                        className="flex-1 sm:flex-none"
                                    >
                                        <XCircle className="w-4 h-4 mr-1.5" />
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
                                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                                        >
                                            <Video className="w-4 h-4 mr-1.5" />
                                            Start Call
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => onComplete?.(appointment._id)}
                                        className="flex-1 sm:flex-none border-green-300 text-green-700 hover:bg-green-50"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-1.5" />
                                        Complete
                                    </Button>
                                </>
                            )}

                            {/* Patient Actions */}
                            {userRole === 'patient' && appointment.status === 'confirmed' && appointment.videoCallEnabled && (
                                <Button
                                    size="sm"
                                    onClick={() => onJoinCall?.(appointment._id)}
                                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                                >
                                    <Video className="w-4 h-4 mr-1.5" />
                                    Join Call
                                </Button>
                            )}

                            {/* Common Actions */}
                            {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onCancel?.(appointment._id)}
                                    className="flex-1 sm:flex-none border-red-300 text-red-700 hover:bg-red-50"
                                >
                                    <Ban className="w-4 h-4 mr-1.5" />
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
        </motion.div >
    );
};

export default AppointmentCard;
