import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Calendar,
  Activity,
  Pill,
  TrendingUp,
  Clock,
  Video,
  FileText,
  Plus,
  ArrowRight,
  Bell
} from 'lucide-react';
import { StatsCard } from '../components/shared/StatsCard';
import { ChartCard } from '../components/shared/ChartCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getPatientDashboardStats, getPatientAppointments, getPatientProfile } from '@/services/dashboard.service';
import { getStoredUser } from '@/services/auth.service';

const healthData = [
  { month: 'Jun', value: 120 },
  { month: 'Jul', value: 118 },
  { month: 'Aug', value: 122 },
  { month: 'Sep', value: 119 },
  { month: 'Oct', value: 115 },
  { month: 'Nov', value: 117 },
];

const activityData = [
  { day: 'Mon', consultations: 2 },
  { day: 'Tue', consultations: 1 },
  { day: 'Wed', consultations: 3 },
  { day: 'Thu', consultations: 2 },
  { day: 'Fri', consultations: 1 },
  { day: 'Sat', consultations: 0 },
  { day: 'Sun', consultations: 0 },
];

const medicationAdherence = [
  { name: 'Taken', value: 92, color: '#10b981' },
  { name: 'Missed', value: 8, color: '#ef4444' },
];


export const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [statsRes, appointmentsRes, profileRes] = await Promise.all([
          getPatientDashboardStats(),
          getPatientAppointments({ status: 'confirmed' }),
          getPatientProfile()
        ]);

        setStats(statsRes.data);
        setAppointments(appointmentsRes.data || []);
        setProfile(profileRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate stats from real data
  const totalConsultations = stats?.total || 0;
  const upcomingAppointments = stats?.confirmed || 0;
  const activeMedications = profile?.currentHealthStatus?.currentMedications?.length || 0;
  const adherenceRate = 92; // Can be calculated from medication tracking

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Patient'}! 👋</h1>
        <p className="text-gray-600">Here's your health overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatsCard
          title="Total Consultations"
          value={totalConsultations}
          change="+12%"
          changeType="positive"
          icon={Activity}
          iconColor="text-primary"
          iconBg="bg-primary/10"
        />
        <StatsCard
          title="Upcoming Appointments"
          value={upcomingAppointments}
          icon={Calendar}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
        />
        <StatsCard
          title="Active Medications"
          value={activeMedications}
          icon={Pill}
          iconColor="text-green-600"
          iconBg="bg-green-100"
        />
        <StatsCard
          title="Adherence Rate"
          value={`${adherenceRate}%`}
          change="+5%"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm"
              onClick={() => navigate('/patient-dashboard/symptom-intake')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="font-medium">Check Symptoms</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm"
              onClick={() => navigate('/patient-dashboard/doctors')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="font-medium">Find Doctor</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm"
              onClick={() => navigate('/patient-dashboard/upload-reports')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <span className="font-medium">Upload Report</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-1.5 sm:gap-2 py-3 sm:py-4 text-xs sm:text-sm"
              onClick={() => navigate('/patient-dashboard/chatbot')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <span className="font-medium">AI Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold">Upcoming Appointments</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate('/patient-dashboard/book-appointment')} className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">View All</span>
                  <ArrowRight className="w-4 h-4 sm:ml-1" />
                </Button>
              </div>
              <div className="space-y-2 sm:space-y-3">
                {loading ? (
                  <p className="text-sm text-gray-500 text-center py-4">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No upcoming appointments</p>
                ) : (
                  appointments.slice(0, 3).map((appointment, index) => (
                    <motion.div
                      key={appointment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
                        <AvatarImage src={appointment.doctor?.profilePicture} />
                        <AvatarFallback>{appointment.doctor?.name?.[0]}{appointment.doctor?.name?.split(' ')[1]?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-gray-900">{appointment.doctor?.name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">{appointment.doctorProfile?.specialties?.[0] || 'General Physician'}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 sm:flex-col sm:items-end">
                        <div className="text-left sm:text-right">
                          <p className="text-xs sm:text-sm font-medium text-gray-900">{appointment.timeSlot}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{new Date(appointment.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        </div>
                        <Badge variant={appointment.consultationMode === 'video' ? 'default' : 'secondary'} className="text-xs">
                          {appointment.consultationMode === 'video' ? <Video className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                          {appointment.consultationMode}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reminders */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold">Today's Reminders</h3>
              <Badge variant="secondary">{profile?.currentHealthStatus?.currentMedications?.length || 0}</Badge>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {loading ? (
                <p className="text-sm text-gray-500 text-center py-4">Loading medications...</p>
              ) : !profile?.currentHealthStatus?.currentMedications || profile.currentHealthStatus.currentMedications.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No active medications</p>
              ) : (
                profile.currentHealthStatus.currentMedications.slice(0, 4).map((med: any, index: number) => (
                  <motion.div
                    key={med._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-gray-50"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">{med.name}</p>
                      <p className="text-xs text-gray-600">{med.dosage} - {med.frequency}x daily</p>
                    </div>
                    <Bell className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </motion.div>
                ))
              )}
            </div>
            <Button
              variant="outline"
              className="w-full mt-3 sm:mt-4 text-xs sm:text-sm"
              onClick={() => navigate('/patient-dashboard/medications')}
            >
              View All Medications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Health Trend */}
        <ChartCard title="Blood Pressure Trend" description="Last 6 months average">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={healthData}>
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Activity Chart */}
        <ChartCard title="Weekly Activity" description="Consultations this week">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData}>
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="consultations" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Medication Adherence Pie */}
        <ChartCard title="Medication Adherence" description="This month">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={medicationAdherence}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {medicationAdherence.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
                formatter={(value: number) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-4">
            {medicationAdherence.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};
