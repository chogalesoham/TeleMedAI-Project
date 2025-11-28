import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Video, CheckCircle, Clock, Users, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
        navigate(`/doctor-dashboard/live-consultation?consultationId=${id}`);
    };

    const handleViewDetails = (id: string) => {
        navigate(`/doctor-dashboard/appointment/${id}`);
    };

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'EEEE, MMM dd');
    };

    const getDateBadgeVariant = (date: Date): "default" | "secondary" | "destructive" | "outline" => {
        if (isToday(date)) return 'default';
        if (isTomorrow(date)) return 'secondary';
        return 'outline';
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

    // Calculate stats
    const stats = useMemo(() => {
        const today = appointments.filter(apt => isToday(new Date(apt.appointmentDate)));
        const tomorrow = appointments.filter(apt => isTomorrow(new Date(apt.appointmentDate)));
        const virtual = appointments.filter(apt => apt.consultationMode === 'tele');

        return {
            total: appointments.length,
            today: today.length,
            tomorrow: tomorrow.length,
            virtual: virtual.length,
        };
    }, [appointments]);

    return (
        <div className="space-y-6">
            {/* Hero Header */}
            <div className="rounded-3xl bg-gradient-to-br from-green-600 via-emerald-500 to-teal-500 p-6 text-white shadow-xl sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                            <Sparkles className="h-4 w-4" />
                            Doctor Dashboard
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                Confirmed Appointments
                            </h1>
                            <p className="mt-2 text-sm text-white/80">
                                Manage your upcoming confirmed consultations and patient care
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                className="bg-white text-green-600 hover:bg-white/90"
                                onClick={() => navigate('/doctor-dashboard/appointment-requests')}
                            >
                                View Requests
                            </Button>
                            <Button
                                variant="outline"
                                className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                                onClick={() => navigate('/doctor-dashboard/appointment-history')}
                            >
                                View History
                            </Button>
                        </div>
                    </div>

                    <div className="w-full rounded-2xl bg-white/10 p-4 backdrop-blur-md lg:max-w-sm">
                        <p className="text-xs uppercase tracking-wide text-white/70">
                            Quick Overview
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-2xl font-bold">{stats.total}</p>
                                <p className="text-xs text-white/80">Total Confirmed</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{stats.today}</p>
                                <p className="text-xs text-white/80">Today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-transparent hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Confirmed</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.total}</p>
                                </div>
                                <div className="rounded-full bg-green-100 p-3">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-transparent hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Today</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
                                </div>
                                <div className="rounded-full bg-blue-100 p-3">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-transparent hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Tomorrow</p>
                                    <p className="text-3xl font-bold text-purple-600">{stats.tomorrow}</p>
                                </div>
                                <div className="rounded-full bg-purple-100 p-3">
                                    <Clock className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-transparent hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Virtual Visits</p>
                                    <p className="text-3xl font-bold text-indigo-600">{stats.virtual}</p>
                                </div>
                                <div className="rounded-full bg-indigo-100 p-3">
                                    <Video className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Appointments Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : appointments.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-10 text-center"
                >
                    <Calendar className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">No confirmed appointments</h3>
                    <p className="text-sm text-muted-foreground">Confirmed appointments will appear here</p>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedAppointments).map(([dateKey, dayAppointments]) => {
                        const date = new Date(dateKey);
                        const dateLabel = getDateLabel(date);
                        const badgeVariant = getDateBadgeVariant(date);

                        return (
                            <div key={dateKey} className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <Badge variant={badgeVariant} className="text-sm font-semibold px-3 py-1">
                                        {dateLabel}
                                    </Badge>
                                    <div className="h-px flex-1 bg-border"></div>
                                    <span className="text-sm text-muted-foreground">
                                        {dayAppointments.length} {dayAppointments.length === 1 ? 'appointment' : 'appointments'}
                                    </span>
                                </div>
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                                    {dayAppointments.map((appointment, index) => (
                                        <motion.div
                                            key={appointment._id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
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
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="rounded-full bg-green-100 p-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            Complete Appointment
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Mark this appointment as completed and add your consultation notes.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAppointment && (
                        <div className="space-y-5">
                            {/* Appointment Details */}
                            <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
                                <div className="flex items-start justify-between text-sm">
                                    <span className="text-muted-foreground">Patient</span>
                                    <span className="font-semibold text-right">{selectedAppointment.patient.name}</span>
                                </div>
                                <div className="flex items-start justify-between text-sm">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-semibold text-right">
                                        {format(new Date(selectedAppointment.appointmentDate), 'PPP')}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between text-sm">
                                    <span className="text-muted-foreground">Time</span>
                                    <span className="font-semibold text-right">
                                        {selectedAppointment.timeSlot.startTime} - {selectedAppointment.timeSlot.endTime}
                                    </span>
                                </div>
                                <div className="flex items-start justify-between text-sm">
                                    <span className="text-muted-foreground">Reason</span>
                                    <span className="font-semibold text-right max-w-[60%]">
                                        {selectedAppointment.reasonForVisit}
                                    </span>
                                </div>
                            </div>

                            {/* Doctor Notes */}
                            <div className="space-y-2">
                                <Label htmlFor="notes" className="text-sm font-semibold">
                                    Consultation Notes <span className="text-muted-foreground font-normal">(Optional)</span>
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Add diagnosis, treatment plan, prescriptions, or follow-up recommendations..."
                                    value={doctorNotes}
                                    onChange={(e) => setDoctorNotes(e.target.value)}
                                    className="min-h-[120px] resize-none"
                                    rows={5}
                                />
                                <p className="text-xs text-muted-foreground">
                                    These notes will be visible to the patient in their appointment history.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsCompleteDialogOpen(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={handleConfirmComplete}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Mark as Completed
                                        </>
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
