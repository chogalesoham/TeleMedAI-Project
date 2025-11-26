import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Loader2, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentService, { Appointment } from '@/services/appointment.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const PastAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('completed');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchPastAppointments();
    }, []);

    const fetchPastAppointments = async () => {
        setIsLoading(true);
        const response = await AppointmentService.getPatientAppointments(userId);

        if (response.success && response.data) {
            // Filter past appointments (completed, cancelled, rejected)
            const past = response.data
                .filter((apt: Appointment) =>
                    apt.status === 'completed' ||
                    apt.status === 'cancelled' ||
                    apt.status === 'rejected' ||
                    (apt.status === 'confirmed' && new Date(apt.appointmentDate) < new Date())
                )
                .sort((a: Appointment, b: Appointment) =>
                    new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
                );

            setAppointments(past);
        } else {
            toast.error(response.error || 'Failed to fetch appointments');
        }
        setIsLoading(false);
    };

    const handleViewDetails = (id: string) => {
        navigate(`/patient-dashboard/appointment/${id}`);
    };

    const handleRebook = (appointment: Appointment) => {
        // Navigate to booking page with doctor info
        navigate('/patient-dashboard/appointment-booking', {
            state: { doctor: appointment.doctor }
        });
    };

    const getFilteredAppointments = () => {
        if (activeTab === 'all') return appointments;
        return appointments.filter(apt => apt.status === activeTab);
    };

    const getTabCount = (status: string) => {
        if (status === 'all') return appointments.length;
        return appointments.filter(apt => apt.status === status).length;
    };

    const filteredAppointments = getFilteredAppointments();

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    Past Appointments
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    View your appointment history
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                        All ({getTabCount('all')})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="text-xs sm:text-sm">
                        Completed ({getTabCount('completed')})
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="text-xs sm:text-sm">
                        Cancelled ({getTabCount('cancelled')})
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="text-xs sm:text-sm">
                        Rejected ({getTabCount('rejected')})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-12"
                        >
                            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No past appointments
                            </h3>
                            <p className="text-gray-600">
                                Your appointment history will appear here
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAppointments.map((appointment, index) => (
                                <motion.div
                                    key={appointment._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <AppointmentCard
                                        appointment={appointment}
                                        userRole="patient"
                                        onViewDetails={handleViewDetails}
                                    />
                                    {/* Additional info for completed appointments */}
                                    {appointment.status === 'completed' && appointment.doctorNotes && (
                                        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                            <div className="flex items-start gap-2">
                                                <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-blue-900">Doctor's Notes</p>
                                                    <p className="text-xs text-blue-700 mt-1">{appointment.doctorNotes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PastAppointments;
