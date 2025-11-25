import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Heart,
  Activity,
  FileText,
  Pill,
  Upload,
  Stethoscope,
  Brain,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const patient = {
    id: id,
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 234-567-8901',
    age: 35,
    gender: 'Male',
    bloodGroup: 'O+',
    address: '123 Main St, New York, NY 10001',
    emergencyContact: '+1 234-567-8999',
    status: 'active',
    joinDate: '2023-06-15',
    lastVisit: '2024-01-20',
    totalAppointments: 12,
    medicalHistory: 'No major illnesses. Seasonal allergies. Regular checkups.',
  };

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-28',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Brown',
      specialty: 'Dermatology',
      date: '2024-02-05',
      time: '2:00 PM',
      status: 'pending',
    },
  ];

  const pastAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2024-01-20',
      time: '10:00 AM',
      status: 'completed',
    },
    {
      id: 2,
      doctor: 'Dr. Emily Davis',
      specialty: 'Pediatrics',
      date: '2024-01-15',
      time: '3:00 PM',
      status: 'completed',
    },
    {
      id: 3,
      doctor: 'Dr. Michael Brown',
      specialty: 'Dermatology',
      date: '2024-01-10',
      time: '11:00 AM',
      status: 'completed',
    },
  ];

  const prescriptions = [
    {
      id: 1,
      medication: 'Lisinopril 10mg',
      doctor: 'Dr. Sarah Johnson',
      date: '2024-01-20',
      duration: '30 days',
      dosage: '1 tablet daily',
    },
    {
      id: 2,
      medication: 'Vitamin D3 1000 IU',
      doctor: 'Dr. Emily Davis',
      date: '2024-01-15',
      duration: '60 days',
      dosage: '1 tablet daily',
    },
  ];

  const reports = [
    { id: 1, name: 'Blood Test Report', doctor: 'Dr. Sarah Johnson', date: '2024-01-20', type: 'Lab Report' },
    { id: 2, name: 'ECG Report', doctor: 'Dr. Sarah Johnson', date: '2024-01-20', type: 'Diagnostic' },
    { id: 3, name: 'Skin Biopsy', doctor: 'Dr. Michael Brown', date: '2024-01-10', type: 'Lab Report' },
  ];

  const aiReports = [
    {
      id: 1,
      date: '2024-01-22',
      symptoms: 'Chest pain, Shortness of breath',
      aiSuggestion: 'Possible cardiac concern. Recommend immediate consultation.',
      priority: 'high',
    },
    {
      id: 2,
      date: '2024-01-10',
      symptoms: 'Skin rash, Itching',
      aiSuggestion: 'Possible allergic reaction. Dermatologist consultation recommended.',
      priority: 'medium',
    },
  ];

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
      inactive: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300',
    };
    return <Badge className={`${colors[status]} font-semibold px-3 py-1 border`}>{status}</Badge>;
  };

  const getAppointmentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800 border-red-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300',
    };
    return <Badge className={`${colors[priority]} font-semibold px-3 py-1 border`}>{priority}</Badge>;
  };

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8 pb-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/patients')}
          className="flex items-center gap-2 hover:bg-blue-50 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </Button>
      </motion.div>

      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-white">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-white shadow-xl">
                  <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {patient.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Patient Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{patient.name}</h1>
                    <p className="text-lg sm:text-xl text-gray-600 font-semibold mt-1">
                      {patient.age} years • {patient.gender}
                    </p>
                  </div>
                  {getStatusBadge(patient.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{patient.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-sm sm:text-base font-medium">Blood Group: {patient.bloodGroup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-5 h-5 text-orange-500" />
                    <span className="text-sm sm:text-base font-medium">Emergency: {patient.emergencyContact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">Last Visit: {patient.lastVisit}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                    Total Appointments
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{patient.totalAppointments}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                    Prescriptions
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{prescriptions.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                  <Pill className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Reports</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{reports.length}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                    Member Since
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {new Date(patient.joinDate).getFullYear()}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                  <User className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50/30">
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="medical" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger
                  value="medical"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Medical History
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Past
                </TabsTrigger>
                <TabsTrigger
                  value="prescriptions"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Prescriptions
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  Reports
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md"
                >
                  AI Reports
                </TabsTrigger>
              </TabsList>

              {/* Medical History Tab */}
              <TabsContent value="medical" className="mt-6">
                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Medical History Summary
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{patient.medicalHistory}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Upcoming Appointments Tab */}
              <TabsContent value="upcoming" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gray-200">
                        <TableHead className="font-bold text-gray-700">Doctor</TableHead>
                        <TableHead className="font-bold text-gray-700">Specialty</TableHead>
                        <TableHead className="font-bold text-gray-700">Date</TableHead>
                        <TableHead className="font-bold text-gray-700">Time</TableHead>
                        <TableHead className="font-bold text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{appointment.doctor}</TableCell>
                          <TableCell className="text-gray-700">{appointment.specialty}</TableCell>
                          <TableCell className="text-gray-700">{appointment.date}</TableCell>
                          <TableCell className="text-gray-700">{appointment.time}</TableCell>
                          <TableCell>{getAppointmentStatusBadge(appointment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Past Appointments Tab */}
              <TabsContent value="past" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gray-200">
                        <TableHead className="font-bold text-gray-700">Doctor</TableHead>
                        <TableHead className="font-bold text-gray-700">Specialty</TableHead>
                        <TableHead className="font-bold text-gray-700">Date</TableHead>
                        <TableHead className="font-bold text-gray-700">Time</TableHead>
                        <TableHead className="font-bold text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAppointments.map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{appointment.doctor}</TableCell>
                          <TableCell className="text-gray-700">{appointment.specialty}</TableCell>
                          <TableCell className="text-gray-700">{appointment.date}</TableCell>
                          <TableCell className="text-gray-700">{appointment.time}</TableCell>
                          <TableCell>{getAppointmentStatusBadge(appointment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Prescriptions Tab */}
              <TabsContent value="prescriptions" className="mt-6">
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-5 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                            <Pill className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{prescription.medication}</h4>
                            <p className="text-sm text-gray-600">Prescribed by {prescription.doctor}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{prescription.date}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Dosage</p>
                          <p className="text-gray-700 font-medium">{prescription.dosage}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Duration</p>
                          <p className="text-gray-700 font-medium">{prescription.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="mt-6">
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{report.name}</p>
                          <p className="text-sm text-gray-600">
                            {report.doctor} • {report.date}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">{report.type}</Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* AI Reports Tab */}
              <TabsContent value="ai" className="mt-6">
                <div className="space-y-4">
                  {aiReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                            <Brain className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{report.date}</p>
                            <p className="font-semibold text-gray-900 mt-1">Symptoms: {report.symptoms}</p>
                          </div>
                        </div>
                        {getPriorityBadge(report.priority)}
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">AI Suggestion:</p>
                        <p className="text-gray-700 leading-relaxed">{report.aiSuggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
