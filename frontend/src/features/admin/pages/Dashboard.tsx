import { motion } from 'framer-motion';
import {
  Users,
  UserCog,
  Calendar,
  DollarSign,
  CheckCircle,
  Activity,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { AdminCard } from '../components/AdminCard';
import { RevenueChart } from '../components/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const Dashboard = () => {
  const stats = [
    {
      title: 'Total Patients',
      value: '2,543',
      icon: Users,
      trend: { value: '12%', isPositive: true },
      description: 'Active patients',
    },
    {
      title: 'Total Doctors',
      value: '147',
      icon: UserCog,
      trend: { value: '8%', isPositive: true },
      description: 'Verified doctors',
    },
    {
      title: 'Pending Approvals',
      value: '12',
      icon: Clock,
      trend: { value: '3', isPositive: false },
      description: 'Doctor requests',
    },
    {
      title: "Today's Appointments",
      value: '89',
      icon: Calendar,
      trend: { value: '5%', isPositive: true },
      description: 'Scheduled today',
    },
    {
      title: 'Revenue This Month',
      value: '$45,678',
      icon: DollarSign,
      trend: { value: '15%', isPositive: true },
      description: 'Total earnings',
    },
    {
      title: 'Active Consultations',
      value: '23',
      icon: Activity,
      description: 'Live sessions',
    },
  ];

  const recentAppointments = [
    {
      id: 1,
      patient: 'John Doe',
      doctor: 'Dr. Sarah Smith',
      time: '10:00 AM',
      status: 'completed',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Brown',
      time: '11:30 AM',
      status: 'in-progress',
    },
    {
      id: 3,
      patient: 'Robert Johnson',
      doctor: 'Dr. Emily Davis',
      time: '2:00 PM',
      status: 'scheduled',
    },
    {
      id: 4,
      patient: 'Maria Garcia',
      doctor: 'Dr. James Wilson',
      time: '3:30 PM',
      status: 'scheduled',
    },
  ];

  const pendingDoctors = [
    { id: 1, name: 'Dr. Alex Thompson', specialty: 'Cardiology', date: '2024-01-15' },
    { id: 2, name: 'Dr. Lisa Anderson', specialty: 'Dermatology', date: '2024-01-14' },
    { id: 3, name: 'Dr. Mark Davis', specialty: 'Pediatrics', date: '2024-01-13' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base font-medium">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 border-green-200 bg-green-50/50 text-green-700 font-semibold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs sm:text-sm">System Online</span>
          </Badge>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
          >
            <AdminCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6 lg:gap-7">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Recent Appointments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{appointment.patient}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 truncate">{appointment.doctor}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <Badge className={`${getStatusColor(appointment.status)} text-xs font-semibold`}>
                        {appointment.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1.5 font-medium">{appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-5 h-11 rounded-xl font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                View All Appointments
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pending Doctor Approvals */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <UserCog className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Pending Doctor Approvals</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="space-y-3">
                {pendingDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{doctor.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5 truncate">{doctor.specialty}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md font-semibold h-9 px-4">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-semibold h-9 px-4">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-5 h-11 rounded-xl font-semibold hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all">
                View All Requests
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
          <CardHeader className="border-b border-gray-100 pb-5">
            <CardTitle className="flex items-center gap-3 text-lg sm:text-xl lg:text-2xl">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="font-bold text-gray-900">Revenue Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 px-4 sm:px-6">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <RevenueChart
                data={[
                  { month: 'Jan', revenue: 32000, appointments: 145 },
                  { month: 'Feb', revenue: 38000, appointments: 178 },
                  { month: 'Mar', revenue: 35000, appointments: 162 },
                  { month: 'Apr', revenue: 42000, appointments: 195 },
                  { month: 'May', revenue: 45000, appointments: 210 },
                  { month: 'Jun', revenue: 48000, appointments: 225 },
                ]}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
