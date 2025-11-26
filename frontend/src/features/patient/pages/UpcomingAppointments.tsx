import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentService, { Appointment } from '@/services/appointment.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';

export const UpcomingAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchUpcomingAppointments();
    }, []);

    const fetchUpcomingAppointments = async () => {
        setIsLoading(true);
        const response = await AppointmentService.getPatientAppointments(userId, 'confirmed');

        if (response.success && response.data) {
            // Filter future appointments and sort by date
            const upcoming = response.data
                .filter((apt: Appointment) => new Date(apt.appointmentDate) >= new Date())
                .sort((a: Appointment, b: Appointment) =>
                    new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
                );

            setAppointments(upcoming);
            if (upcoming.length > 0) {
                setNextAppointment(upcoming[0]);
            }
        } else {
            toast.error(response.error || 'Failed to fetch appointments');
        }
        setIsLoading(false);
    };

    const getTimeUntilAppointment = (date: Date) => {
        const now = new Date();
        const appointmentDate = new Date(date);

        const days = differenceInDays(appointmentDate, now);
        const hours = differenceInHours(appointmentDate, now) % 24;
        const minutes = differenceInMinutes(appointmentDate, now) % 60;

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
    };

    const handleJoinCall = (id: string) => {
        // Navigate to video call page (to be implemented)
        toast.info('Video call feature coming soon!');
    };

    const handleCancel = async (id: string) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        const response = await AppointmentService.cancelAppointment(id, reason);
        if (response.success) {
            toast.success('Appointment cancelled successfully');
            fetchUpcomingAppointments();
        } else {
            toast.error(response.error || 'Failed to cancel appointment');
        }
    };

    const handleViewDetails = (id: string) => {
        navigate(`/patient-dashboard/appointment/${id}`);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Upcoming Appointments
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Your confirmed upcoming consultations
                </p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* Next Appointment Highlight */}
                    {nextAppointment && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-transparent">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Next Appointment
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Time until appointment</p>
                                            <p className="text-2xl font-bold text-primary">
                                                {getTimeUntilAppointment(nextAppointment.appointmentDate)}
                                            </p>
                                        </div>
                                        {nextAppointment.videoCallEnabled && (
                                            <Badge className="bg-green-100 text-green-800 border-green-300">
                                                <Video className="w-3 h-3 mr-1" />
                                                Video Ready
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Date</p>
                                            <p className="font-medium">
                                                {format(new Date(nextAppointment.appointmentDate), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Time</p>
                                            <p className="font-medium">
                                                {nextAppointment.timeSlot.startTime}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Doctor</p>
                                            <p className="font-medium">Dr. {nextAppointment.doctor.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Type</p>
                                            <p className="font-medium capitalize">
                                                {nextAppointment.consultationMode === 'tele' ? 'Video' : 'In-Person'}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* All Upcoming Appointments */}
                    {appointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No upcoming appointments
                            </h3>
                            <p className="text-gray-600">
                                Book an appointment with a doctor to get started
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                All Upcoming ({appointments.length})
                            </h2>
                            {appointments.map((appointment, index) => (
                                <motion.div
                                    key={appointment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <AppointmentCard
                                        appointment={appointment}
                                        userRole="patient"
                                        onCancel={handleCancel}
                                        onJoinCall={handleJoinCall}
                                        onViewDetails={handleViewDetails}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UpcomingAppointments;
