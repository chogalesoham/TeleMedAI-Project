import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, CheckCircle, XCircle } from 'lucide-react';
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

export const AppointmentRequests = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchPendingAppointments();
    }, []);

    const fetchPendingAppointments = async () => {
        setIsLoading(true);
        const response = await AppointmentService.getDoctorAppointments(userId, 'pending');

        if (response.success && response.data) {
            // Sort by date (earliest first)
            const sorted = response.data.sort((a: Appointment, b: Appointment) =>
                new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
            );
            setAppointments(sorted);
        } else {
            toast.error(response.error || 'Failed to fetch appointment requests');
        }
        setIsLoading(false);
    };

    const handleApproveClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setActionType('approve');
        setNotes('');
    };

    const handleRejectClick = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setActionType('reject');
        setNotes('');
    };

    const handleConfirmAction = async () => {
        if (!selectedAppointment || !actionType) return;

        if (actionType === 'reject' && !notes.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setIsSubmitting(true);

        const response = actionType === 'approve'
            ? await AppointmentService.approveAppointment(selectedAppointment._id, notes)
            : await AppointmentService.rejectAppointment(selectedAppointment._id, notes);

        if (response.success) {
            toast.success(
                actionType === 'approve'
                    ? 'Appointment approved successfully'
                    : 'Appointment rejected'
            );
            fetchPendingAppointments();
            handleCloseDialog();
        } else {
            toast.error(response.error || `Failed to ${actionType} appointment`);
        }

        setIsSubmitting(false);
    };

    const handleCloseDialog = () => {
        setSelectedAppointment(null);
        setActionType(null);
        setNotes('');
    };

    const handleViewDetails = (id: string) => {
        navigate(`/doctor-dashboard/appointment/${id}`);
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Appointment Requests
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Review and manage pending appointment requests
                </p>
            </div>

            {/* Stats Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending Requests</p>
                            <p className="text-3xl font-bold text-primary">{appointments.length}</p>
                        </div>
                        <Calendar className="w-12 h-12 text-primary opacity-20" />
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
                    <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No pending requests
                    </h3>
                    <p className="text-gray-600">
                        All appointment requests have been reviewed
                    </p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((appointment, index) => (
                        <motion.div
                            key={appointment._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <AppointmentCard
                                appointment={appointment}
                                userRole="doctor"
                                onApprove={() => handleApproveClick(appointment)}
                                onReject={() => handleRejectClick(appointment)}
                                onViewDetails={handleViewDetails}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Approve/Reject Dialog */}
            <Dialog open={!!selectedAppointment} onOpenChange={handleCloseDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {actionType === 'approve' ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    Approve Appointment
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-red-600" />
                                    Reject Appointment
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === 'approve'
                                ? 'Confirm this appointment and enable video call for the patient.'
                                : 'Provide a reason for rejecting this appointment request.'}
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
                                        {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Time:</span>
                                    <span className="font-medium">
                                        {selectedAppointment.timeSlot.startTime}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Reason:</span>
                                    <span className="font-medium text-right max-w-[200px]">
                                        {selectedAppointment.reasonForVisit}
                                    </span>
                                </div>
                            </div>

                            {/* Notes/Reason Input */}
                            <div>
                                <Label htmlFor="notes">
                                    {actionType === 'approve' ? 'Notes (Optional)' : 'Reason for Rejection *'}
                                </Label>
                                <Textarea
                                    id="notes"
                                    placeholder={
                                        actionType === 'approve'
                                            ? 'Add any notes for the patient...'
                                            : 'Please provide a reason for rejection...'
                                    }
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="mt-2"
                                    rows={3}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleCloseDialog}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className={`flex-1 ${actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''
                                        }`}
                                    onClick={handleConfirmAction}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {actionType === 'approve' ? 'Approve' : 'Reject'}
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

export default AppointmentRequests;
