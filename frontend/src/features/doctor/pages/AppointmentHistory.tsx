import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Calendar, TrendingUp, CheckCircle, XCircle, Ban, Sparkles, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

    const handleStartCall = (id: string) => {
        navigate(`/doctor-dashboard/live-consultation?consultationId=${id}`);
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

    const statsCards = [
        {
            label: 'Total Appointments',
            value: stats.total,
            icon: BarChart3,
            color: 'text-gray-900',
            bgColor: 'from-gray-50',
            borderColor: 'border-gray-200',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
        },
        {
            label: 'Completed',
            value: stats.completed,
            icon: CheckCircle,
            color: 'text-green-600',
            bgColor: 'from-green-50',
            borderColor: 'border-green-200',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-600',
        },
        {
            label: 'Cancelled',
            value: stats.cancelled,
            icon: XCircle,
            color: 'text-gray-600',
            bgColor: 'from-gray-50',
            borderColor: 'border-gray-200',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600',
        },
        {
            label: 'Rejected',
            value: stats.rejected,
            icon: Ban,
            color: 'text-red-600',
            bgColor: 'from-red-50',
            borderColor: 'border-red-200',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Hero Header */}
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 p-6 text-white shadow-xl sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                            <Sparkles className="h-4 w-4" />
                            Doctor Dashboard
                        </div>
                        <div>
                            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                Appointment History
                            </h1>
                            <p className="mt-2 text-sm text-white/80">
                                Review your past consultations and track your performance metrics
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.completed}</p>
                                    <p className="text-xs text-white/80">Completed</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/20"></div>
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                <div>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                    <p className="text-xs text-white/80">Total</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full rounded-2xl bg-white/10 p-4 backdrop-blur-md lg:max-w-sm">
                        <p className="text-xs uppercase tracking-wide text-white/70 mb-3">
                            Performance Overview
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/80">Completion Rate</span>
                                <span className="font-semibold">
                                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all"
                                    style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`${stat.borderColor} bg-gradient-to-br ${stat.bgColor} to-transparent hover:shadow-md transition-shadow`}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                        </div>
                                        <div className={`rounded-full ${stat.iconBg} p-2 sm:p-3`}>
                                            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.iconColor}`} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>

            {/* Modern Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 rounded-2xl bg-muted/60 p-1">
                    <TabsTrigger
                        value="all"
                        className="rounded-xl text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span>All</span>
                            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                {getTabCount('all')}
                            </Badge>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="rounded-xl text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span>Completed</span>
                            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                {getTabCount('completed')}
                            </Badge>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="cancelled"
                        className="rounded-xl text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span>Cancelled</span>
                            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                {getTabCount('cancelled')}
                            </Badge>
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="rejected"
                        className="rounded-xl text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <span>Rejected</span>
                            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">
                                {getTabCount('rejected')}
                            </Badge>
                        </div>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredAppointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-10 text-center"
                        >
                            <Calendar className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
                            <h3 className="text-lg font-semibold text-foreground">No appointments found</h3>
                            <p className="text-sm text-muted-foreground">
                                {activeTab === 'all'
                                    ? 'Your appointment history will appear here'
                                    : `No ${activeTab} appointments in your history`
                                }
                            </p>
                        </motion.div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                            {filteredAppointments.map((appointment, index) => (
                                <motion.div
                                    key={appointment._id}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <AppointmentCard
                                        appointment={appointment}
                                        userRole="doctor"
                                        onJoinCall={handleStartCall}
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
