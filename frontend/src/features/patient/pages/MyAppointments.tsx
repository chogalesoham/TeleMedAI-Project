import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
    Calendar,
    Loader2,
    Search,
    SlidersHorizontal,
    FilterX,
    Stethoscope,
    Clock,
    Sparkles,
    LayoutGrid,
    List,
    Filter,
} from 'lucide-react';
import AppointmentCard from '@/components/appointments/AppointmentCard';
import AppointmentService, { Appointment } from '@/services/appointment.service';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type TabKey = 'all' | 'upcoming' | 'past';

interface MyAppointmentsProps {
    defaultTab?: TabKey;
}

const statusOptions = [
    { label: 'Any status', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
    { label: 'Rejected', value: 'rejected' },
];

const isTabKey = (value: string | null): value is TabKey =>
    value === 'all' || value === 'upcoming' || value === 'past';

const emptyStateCopy: Record<TabKey, { title: string; subtitle: string }> = {
    all: {
        title: 'No appointments yet',
        subtitle: 'Book a consultation to get started',
    },
    upcoming: {
        title: 'No upcoming sessions',
        subtitle: 'All confirmed visits will appear here',
    },
    past: {
        title: 'No past visits found',
        subtitle: 'Completed, cancelled, or rejected visits will show up here',
    },
};

export const MyAppointments = ({ defaultTab = 'all' }: MyAppointmentsProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>(
        isTabKey(searchParams.get('tab')) ? (searchParams.get('tab') as TabKey) : defaultTab
    );
    const [filters, setFilters] = useState({
        doctor: 'all',
        status: 'all',
        from: '',
        to: '',
    });
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showFilters, setShowFilters] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && isTabKey(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const fetchAppointments = async () => {
        if (!userId) {
            toast.error('Missing user session');
            return;
        }

        setIsLoading(true);
        const response = await AppointmentService.getPatientAppointments(userId);

        if (response.success && response.data) {
            setAppointments(response.data);
        } else {
            toast.error(response.error || 'Failed to fetch appointments');
        }
        setIsLoading(false);
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

    const handleJoinCall = (_id: string) => {
        toast.info('Video call feature coming soon!');
    };

    const handleViewDetails = (id: string) => {
        const appointment = appointments.find((apt) => apt._id === id);
        if (appointment) {
            setSelectedAppointment(appointment);
            setIsDetailsOpen(true);
        }
    };

    const categorizedAppointments = useMemo(() => {
        const now = new Date();
        const upcomingStatuses = ['pending', 'confirmed'];
        const pastStatuses = ['completed', 'cancelled', 'rejected'];

        const upcoming = appointments
            .filter(
                (apt) =>
                    upcomingStatuses.includes(apt.status) && new Date(apt.appointmentDate) >= now
            )
            .sort(
                (a, b) =>
                    new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
            );

        const past = appointments
            .filter((apt) => {
                const aptDate = new Date(apt.appointmentDate);
                return pastStatuses.includes(apt.status) || aptDate < now;
            })
            .sort(
                (a, b) =>
                    new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
            );

        return {
            all: appointments,
            upcoming,
            past,
        };
    }, [appointments]);

    const doctorOptions = useMemo(() => {
        const uniqueDoctors = new Map<string, string>();
        appointments.forEach((apt) => {
            uniqueDoctors.set(apt.doctor._id, apt.doctor.name);
        });
        return Array.from(uniqueDoctors, ([value, label]) => ({ value, label }));
    }, [appointments]);

    const filteredByTab = useMemo(() => {
        const applyFilters = (list: Appointment[]) => {
            return list.filter((apt) => {
                const term = searchQuery.trim().toLowerCase();
                const matchesSearch =
                    !term ||
                    apt.doctor.name.toLowerCase().includes(term) ||
                    apt.reasonForVisit.toLowerCase().includes(term) ||
                    apt.status.toLowerCase().includes(term) ||
                    apt.consultationMode.toLowerCase().includes(term);

                const matchesDoctor =
                    filters.doctor === 'all' || apt.doctor._id === filters.doctor;

                const matchesStatus =
                    filters.status === 'all' || apt.status === filters.status;

                const aptDate = new Date(apt.appointmentDate);
                const matchesFrom = !filters.from || aptDate >= new Date(filters.from);
                const matchesTo = !filters.to || aptDate <= new Date(filters.to);

                return (
                    matchesSearch &&
                    matchesDoctor &&
                    matchesStatus &&
                    matchesFrom &&
                    matchesTo
                );
            });
        };

        return {
            all: applyFilters(categorizedAppointments.all),
            upcoming: applyFilters(categorizedAppointments.upcoming),
            past: applyFilters(categorizedAppointments.past),
        };
    }, [categorizedAppointments, filters, searchQuery]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.doctor !== 'all') count += 1;
        if (filters.status !== 'all') count += 1;
        if (filters.from) count += 1;
        if (filters.to) count += 1;
        return count;
    }, [filters]);

    const nextAppointment = useMemo(
        () => filteredByTab.upcoming[0] || categorizedAppointments.upcoming[0] || null,
        [filteredByTab.upcoming, categorizedAppointments.upcoming]
    );

    const quickStatuses: Array<{ label: string; value: string }> = [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
    ];

    const handleQuickStatus = (value: string) =>
        setFilters((prev) => ({
            ...prev,
            status: prev.status === value ? 'all' : value,
        }));

    const handleTabChange = (value: string) => {
        if (isTabKey(value)) {
            setActiveTab(value);
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                if (value === 'all') {
                    next.delete('tab');
                } else {
                    next.set('tab', value);
                }
                return next;
            });
        }
    };

    const resetFilters = () =>
        setFilters({
            doctor: 'all',
            status: 'all',
            from: '',
            to: '',
        });

    const detailRow = (label: string, value?: string | number) => (
        <div className="flex items-start justify-between text-sm">
            <span className="text-muted-foreground">{label}</span>
            <span className="font-medium text-right">{value || '-'}</span>
        </div>
    );

    const stats = [
        {
            label: 'All Appointments',
            value: categorizedAppointments.all.length,
            helper: 'Across every status',
        },
        {
            label: 'Upcoming',
            value: categorizedAppointments.upcoming.length,
            helper: 'Confirmed & pending',
        },
        {
            label: 'Past Visits',
            value: categorizedAppointments.past.length,
            helper: 'Completed history',
        },
    ];

    const renderList = (tab: TabKey) => {
        const list = filteredByTab[tab];
        const copy = emptyStateCopy[tab];

        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        if (list.length === 0) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/30 p-10 text-center"
                >
                    <Calendar className="mx-auto mb-4 h-14 w-14 text-muted-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">{copy.title}</h3>
                    <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
                </motion.div>
            );
        }

        const containerClass =
            viewMode === 'grid'
                ? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'
                : 'flex flex-col gap-4';

        return (
            <div className={containerClass}>
                {list.map((appointment, index) => (
                    <motion.div
                        key={appointment._id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
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
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500 p-6 text-white shadow-xl sm:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/80">
                                <Sparkles className="h-4 w-4" />
                                Care hub
                            </div>
                            <div>
                                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                                    Your appointments, reinvented
                                </h1>
                                <p className="mt-2 text-sm text-white/80">
                                    Track every visit, follow-ups, and payments from a single elegant view.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    className="bg-white text-primary hover:bg-white/90"
                                    onClick={() => navigate('/patient-dashboard/appointment-booking')}
                                >
                                    Book new visit
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                                    onClick={() => navigate('/patient-dashboard/support')}
                                >
                                    Need help?
                                </Button>
                            </div>
                        </div>

                        <div className="w-full rounded-2xl bg-white/10 p-4 backdrop-blur-md lg:max-w-sm">
                            <p className="text-xs uppercase tracking-wide text-white/70">
                                Next on your calendar
                            </p>
                            {nextAppointment ? (
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            Dr. {nextAppointment.doctor.name}
                                        </p>
                                        <p className="text-sm text-white/80 capitalize">
                                            {nextAppointment.consultationMode === 'tele' ? 'Virtual visit' : 'In-clinic visit'}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <div>
                                            <p className="text-white/70">Date</p>
                                            <p className="font-semibold">
                                                {format(new Date(nextAppointment.appointmentDate), 'EEE, MMM dd')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/70">Time</p>
                                            <p className="font-semibold">
                                                {nextAppointment.timeSlot.startTime} – {nextAppointment.timeSlot.endTime}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full bg-white/20 text-white hover:bg-white/30"
                                        onClick={() => handleViewDetails(nextAppointment._id)}
                                    >
                                        View details
                                    </Button>
                                </div>
                            ) : (
                                <div className="mt-3 space-y-2 text-sm text-white/80">
                                    <p>No upcoming appointments yet.</p>
                                    <p>Book your next consultation to keep the momentum going.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border bg-card p-4 shadow-sm"
                        >
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.helper}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="rounded-2xl border bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <SlidersHorizontal className="h-4 w-4 text-primary" />
                            Smart filters
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center rounded-full border bg-muted px-1 py-1">
                                {(['list', 'grid'] as Array<'list' | 'grid'>).map((mode) => {
                                    const Icon = mode === 'list' ? List : LayoutGrid;
                                    return (
                                        <Button
                                            key={mode}
                                            variant={viewMode === mode ? 'default' : 'ghost'}
                                            size="sm"
                                            className={`h-8 w-8 rounded-full p-0 ${viewMode === mode ? 'shadow' : ''}`}
                                            onClick={() => setViewMode(mode)}
                                            aria-label={`Switch to ${mode} view`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="lg:hidden"
                                onClick={() => setShowFilters((prev) => !prev)}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                {showFilters ? 'Hide filters' : 'Show filters'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetFilters}
                                disabled={!activeFiltersCount}
                            >
                                <FilterX className="mr-2 h-4 w-4" />
                                Clear
                                {activeFiltersCount > 0 && (
                                    <Badge className="ml-2 bg-primary/10 text-primary">
                                        {activeFiltersCount}
                                    </Badge>
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {quickStatuses.map((chip) => (
                            <Button
                                key={chip.value}
                                size="sm"
                                variant={filters.status === chip.value ? 'default' : 'secondary'}
                                className={`rounded-full px-3 py-1 text-xs ${
                                    filters.status === chip.value ? '' : 'bg-muted text-muted-foreground'
                                }`}
                                onClick={() => handleQuickStatus(chip.value)}
                            >
                                {chip.label}
                            </Button>
                        ))}
                    </div>

                    <div
                        className={`mt-4 grid gap-4 lg:grid-cols-4 ${
                            showFilters ? 'grid' : 'hidden lg:grid'
                        }`}
                    >
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="Search by doctor, reason, or status"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                />
                            </div>
                        </div>
                        <Select
                            value={filters.doctor}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, doctor: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All doctors</SelectItem>
                                {doctorOptions.map((doc) => (
                                    <SelectItem key={doc.value} value={doc.value}>
                                        Dr. {doc.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.status}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, status: value }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                            <Input
                                type="date"
                                value={filters.from}
                                onChange={(event) =>
                                    setFilters((prev) => ({ ...prev, from: event.target.value }))
                                }
                            />
                            <Input
                                type="date"
                                value={filters.to}
                                onChange={(event) =>
                                    setFilters((prev) => ({ ...prev, to: event.target.value }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
                    <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-muted/60 p-1">
                        {(['all', 'upcoming', 'past'] as TabKey[]).map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="rounded-xl text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow"
                            >
                                <div className="flex flex-col">
                                    <span className="capitalize">{tab}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {filteredByTab[tab].length} items
                                    </span>
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {(['all', 'upcoming', 'past'] as TabKey[]).map((tab) => (
                        <TabsContent key={tab} value={tab}>
                            {renderList(tab)}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <Sheet
                open={isDetailsOpen}
                onOpenChange={(open) => {
                    setIsDetailsOpen(open);
                    if (!open) {
                        setSelectedAppointment(null);
                    }
                }}
            >
                <SheetContent side="right" className="w-full overflow-hidden p-0 sm:max-w-lg">
                    <ScrollArea className="h-full p-6">
                        {selectedAppointment && (
                            <>
                                <SheetHeader className="mb-6 space-y-3">
                                    <SheetTitle className="text-left text-2xl font-semibold">
                                        Appointment Details
                                    </SheetTitle>
                                    <SheetDescription className="text-left">
                                        Stay on top of your consultation logistics
                                    </SheetDescription>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {selectedAppointment.status}
                                        </Badge>
                                        <Badge variant="outline" className="capitalize">
                                            {selectedAppointment.consultationMode === 'tele'
                                                ? 'Virtual'
                                                : 'In-person'}
                                        </Badge>
                                    </div>
                                </SheetHeader>

                                <div className="space-y-6">
                                    <div className="rounded-2xl border bg-muted/40 p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                <Stethoscope className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Doctor
                                                </p>
                                                <p className="text-base font-semibold">
                                                    Dr. {selectedAppointment.doctor.name}
                                                </p>
                                                {selectedAppointment.doctorProfile?.specialties?.[0] && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedAppointment.doctorProfile.specialties[0]}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-2xl border p-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold">
                                            <Clock className="h-4 w-4 text-primary" />
                                            Schedule
                                        </div>
                                        {detailRow(
                                            'Date',
                                            format(new Date(selectedAppointment.appointmentDate), 'PPP')
                                        )}
                                        {detailRow(
                                            'Time',
                                            `${selectedAppointment.timeSlot.startTime} - ${selectedAppointment.timeSlot.endTime}`
                                        )}
                                        {detailRow(
                                            'Reason',
                                            selectedAppointment.reasonForVisit
                                        )}
                                    </div>

                                    <div className="space-y-3 rounded-2xl border p-4">
                                        <p className="text-sm font-semibold">Payment</p>
                                        {detailRow(
                                            'Total amount',
                                            `${selectedAppointment.payment.currency} ${selectedAppointment.payment.totalAmount}`
                                        )}
                                        {detailRow(
                                            'Status',
                                            selectedAppointment.payment.paymentStatus
                                        )}
                                        {detailRow(
                                            'Method',
                                            selectedAppointment.payment.paymentMethod
                                        )}
                                    </div>

                                    <div className="space-y-3 rounded-2xl border p-4">
                                        <p className="text-sm font-semibold">Additional Notes</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedAppointment.doctorNotes ||
                                                'Notes will appear here after the consultation.'}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default MyAppointments;
