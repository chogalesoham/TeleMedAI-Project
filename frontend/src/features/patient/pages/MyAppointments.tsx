import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Calendar } from 'lucide-react';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentService, { Appointment } from '@/services/appointment.service';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const MyAppointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        filterAppointments();
    }, [appointments, searchQuery, activeTab]);

    const fetchAppointments = async () => {
        setIsLoading(true);
        const response = await AppointmentService.getPatientAppointments(userId);

        if (response.success && response.data) {
            setAppointments(response.data);
        } else {
            toast.error(response.error || 'Failed to fetch appointments');
        }
        setIsLoading(false);
    };

    const filterAppointments = () => {
        let filtered = appointments;

        // Filter by tab
        if (activeTab !== 'all') {
            filtered = filtered.filter(apt => apt.status === activeTab);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(apt =>
                apt.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.reasonForVisit.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredAppointments(filtered);
    };

    const handleCancel = async (id: string) => {
        const reason = prompt('Please provide a reason for cancellation:');
        if (!reason) return;

        const response = await AppointmentService.cancelAppointment(id, reason);
        if (response.success) {
            toast.success('Appointment cancelled successfully');
            fetchAppointments();
        } else {
            toast.error(response.error || 'Failed to cancel appointment');
        }
    };

    const handleJoinCall = (id: string) => {
        // Navigate to video call page (to be implemented)
        toast.info('Video call feature coming soon!');
    };

    const handleViewDetails = (id: string) => {
        navigate(`/patient-dashboard/appointment/${id}`);
    };

    const getTabCount = (status: string) => {
        if (status === 'all') return appointments.length;
        return appointments.filter(apt => apt.status === status).length;
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    My Appointments
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Manage all your appointments
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                    type="text"
                    placeholder="Search by doctor name or reason..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                    <TabsTrigger value="all" className="text-xs sm:text-sm">
                        All ({getTabCount('all')})
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="text-xs sm:text-sm">
                        Pending ({getTabCount('pending')})
                    </TabsTrigger>
                    <TabsTrigger value="confirmed" className="text-xs sm:text-sm">
                        Confirmed ({getTabCount('confirmed')})
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
                            <p className="text-gray-600 mb-4">
                                {searchQuery
                                    ? 'Try adjusting your search'
                                    : 'You haven\'t booked any appointments yet'}
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
                                        onCancel={handleCancel}
                                        onJoinCall={handleJoinCall}
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

export default MyAppointments;
