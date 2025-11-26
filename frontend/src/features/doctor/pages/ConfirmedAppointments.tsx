import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Video, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentService, { Appointment } from '@/services/appointment.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isTomorrow } from 'date-fns';

export const ConfirmedAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
    const [doctorNotes, setDoctorNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchConfirmedAppointments();
    }, []);

    const fetchConfirmedAppointments = async () => {
        setIsLoading(true);
        const response = await AppointmentService.getDoctorAppointments(userId, 'confirmed');

        if (response.success && response.data) {
            // Filter future appointments and sort by date
            const upcoming = response.data
                .filter((apt: Appointment) => new Date(apt.appointmentDate) >= new Date())
                .sort((a: Appointment, b: Appointment) =>
                    new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
                );
            setAppointments(upcoming);
        } else {
            toast.error(response.error || 'Failed to fetch confirmed appointments');
        }
        setIsLoading(false);
    };

    const handleCompleteClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setDoctorNotes('');
        setIsCompleteDialogOpen(true);
    };

    const handleConfirmComplete = async () => {
        if (!selectedAppointment) return;

        setIsSubmitting(true);

        const response = await AppointmentService.completeAppointment(
            selectedAppointment._id,
            doctorNotes
        );

        if (response.success) {
            toast.success('Appointment marked as completed');
            fetchConfirmedAppointments();
            setIsCompleteDialogOpen(false);
            setSelectedAppointment(null);
            setDoctorNotes('');
        } else {
            toast.error(response.error || 'Failed to complete appointment');
        }

        setIsSubmitting(false);
    };

    const handleJoinCall = (id: string) => {
        // Navigate to video call page (to be implemented)
        toast.info('Video call feature coming soon!');
    };

    const handleViewDetails = (id: string) => {
        navigate(`/doctor-dashboard/appointment/${id}`);
    };

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'EEEE, MMM dd');
    };

    // Group appointments by date
    const groupedAppointments = appointments.reduce((groups: Record<string, Appointment[]>, appointment) => {
        const dateKey = format(new Date(appointment.appointmentDate), 'yyyy-MM-dd');
        if (!groups[dateKey]) {
            groups[dateKey] = [];
        }
        groups[dateKey].push(appointment);
        return groups;
    }, {});

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Confirmed Appointments
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Your upcoming confirmed consultations
                </p>
            </div>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-green-50 to-transparent border-green-200">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Confirmed Appointments</p>
                            <p className="text-3xl font-bold text-green-600">{appointments.length}</p>
                        </div>
                        <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                    </div>
                </CardContent>
            </Card>

            {/* Appointments List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : appointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                >
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No confirmed appointments
                    </h3>
                    <p className="text-gray-600">
                        Confirmed appointments will appear here
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedAppointments).map(([dateKey, dayAppointments]) => {
                        const date = new Date(dateKey);
                        return (
                            <div key={dateKey}>
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    {getDateLabel(date)}
                                </h2>
                                <div className="space-y-4">
                                    {dayAppointments.map((appointment, index) => (
                                        <motion.div
                                            key={appointment._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <AppointmentCard
                                                appointment={appointment}
                                                userRole="doctor"
                                                onComplete={() => handleCompleteClick(appointment)}
                                                onJoinCall={handleJoinCall}
                                                onViewDetails={handleViewDetails}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Complete Appointment Dialog */}
            <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Complete Appointment
                        </DialogTitle>
                        <DialogDescription>
                            Mark this appointment as completed and add your notes.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAppointment && (
                        <div className="space-y-4">
                            {/* Appointment Details */}
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Patient:</span>
                                    <span className="font-medium">{selectedAppointment.patient.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Date:</span>
                                    <span className="font-medium">
                                        {format(new Date(selectedAppointment.appointmentDate), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium">
                                        {selectedAppointment.timeSlot.startTime}
                                    </span>
                                </div>
                            </div>

                            {/* Doctor Notes */}
                            <div>
                                <Label htmlFor="notes">Doctor's Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add consultation notes, diagnosis, or recommendations..."
                                    value={doctorNotes}
                                    onChange={(e) => setDoctorNotes(e.target.value)}
                                    className="mt-2"
                                    rows={4}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsCompleteDialogOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleConfirmComplete}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Mark as Completed'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ConfirmedAppointments;
