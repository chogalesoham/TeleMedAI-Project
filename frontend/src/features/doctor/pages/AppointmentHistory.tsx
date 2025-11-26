import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentService, { Appointment } from '@/services/appointment.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const AppointmentHistory = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        cancelled: 0,
        rejected: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchAppointmentHistory();
        fetchStats();
    }, []);

    const fetchAppointmentHistory = async () => {
        setIsLoading(true);
        const response = await AppointmentService.getDoctorAppointments(userId);

        if (response.success && response.data) {
            // Filter past appointments
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
            toast.error(response.error || 'Failed to fetch appointment history');
        }
        setIsLoading(false);
    };

    const fetchStats = async () => {
        const response = await AppointmentService.getAppointmentStats();
        if (response.success && response.data) {
            setStats(response.data);
        }
    };

    const handleViewDetails = (id: string) => {
        navigate(`/doctor-dashboard/appointment/${id}`);
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
                    Appointment History
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    View your past appointments and statistics
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Total Appointments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Completed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Cancelled
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-gray-600">{stats.cancelled}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">
                            Rejected
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                    </CardContent>
                </Card>
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
                                No appointments found
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
                                        userRole="doctor"
                                        onViewDetails={handleViewDetails}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AppointmentHistory;
