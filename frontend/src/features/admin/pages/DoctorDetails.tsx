import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Award,
  Building2,
  GraduationCap,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
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

export const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const doctor = {
    id: id,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    email: 'sarah.j@hospital.com',
    phone: '+1 234-567-8901',
    experience: '12 years',
    qualification: 'MD, FACC, Board Certified Cardiologist',
    hospital: 'Central Medical Hospital',
    location: 'New York, NY',
    bio: 'Dr. Sarah Johnson is a highly experienced cardiologist with over 12 years of practice. She specializes in preventive cardiology, heart disease management, and advanced cardiac imaging. Dr. Johnson is committed to providing comprehensive and compassionate care to her patients.',
    consultationFee: '$150',
    rating: 4.8,
    totalReviews: 245,
    status: 'active',
    joinDate: '2023-01-15',
    patients: 145,
  };

  const availability = [
    { day: 'Monday', time: '9:00 AM - 5:00 PM' },
    { day: 'Tuesday', time: '9:00 AM - 5:00 PM' },
    { day: 'Wednesday', time: '9:00 AM - 5:00 PM' },
    { day: 'Thursday', time: '9:00 AM - 3:00 PM' },
    { day: 'Friday', time: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];

  const pastAppointments = [
    { id: 1, patient: 'John Doe', date: '2024-01-20', time: '10:00 AM', status: 'completed' },
    { id: 2, patient: 'Jane Smith', date: '2024-01-19', time: '2:00 PM', status: 'completed' },
    { id: 3, patient: 'Robert Johnson', date: '2024-01-18', time: '11:00 AM', status: 'completed' },
    { id: 4, patient: 'Maria Garcia', date: '2024-01-17', time: '3:30 PM', status: 'completed' },
  ];

  const upcomingAppointments = [
    { id: 1, patient: 'David Lee', date: '2024-01-25', time: '10:00 AM', status: 'confirmed' },
    { id: 2, patient: 'Emily Chen', date: '2024-01-26', time: '2:00 PM', status: 'confirmed' },
    { id: 3, patient: 'Michael Brown', date: '2024-01-27', time: '11:00 AM', status: 'pending' },
  ];

  const reviews = [
    {
      id: 1,
      patient: 'John Doe',
      rating: 5,
      comment: 'Excellent doctor! Very thorough and caring.',
      date: '2024-01-15',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      rating: 5,
      comment: 'Dr. Johnson is amazing. She takes time to explain everything clearly.',
      date: '2024-01-10',
    },
    {
      id: 3,
      patient: 'Robert Johnson',
      rating: 4,
      comment: 'Very professional and knowledgeable. Highly recommend!',
      date: '2024-01-05',
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { className: string; icon: any; label: string }> = {
      active: {
        className: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300',
        icon: CheckCircle,
        label: 'Active',
      },
      pending: {
        className: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-300',
        icon: AlertCircle,
        label: 'Pending',
      },
      suspended: {
        className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300',
        icon: XCircle,
        label: 'Suspended',
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} font-semibold px-3 py-1 border`}>
        <Icon className="w-3.5 h-3.5 mr-1.5" />
        {config.label}
      </Badge>
    );
  };

  const getAppointmentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8 pb-8">
      {/* Back Button */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/doctors')}
          className="flex items-center gap-2 hover:bg-blue-50 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Doctors
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
                    {doctor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Doctor Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{doctor.name}</h1>
                    <p className="text-lg sm:text-xl text-blue-600 font-semibold mt-1">{doctor.specialty}</p>
                  </div>
                  {getStatusBadge(doctor.status)}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{doctor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{doctor.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{doctor.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Award className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">{doctor.consultationFee} per visit</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(doctor.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">{doctor.rating}</span>
                  <span className="text-sm text-gray-500">({doctor.totalReviews} reviews)</span>
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
                    Total Patients
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{doctor.patients}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                  <Award className="w-7 h-7 text-white" />
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
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Experience</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{doctor.experience}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{doctor.rating}/5</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-md">
                  <Star className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">
                    Total Reviews
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{doctor.totalReviews}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                  <Star className="w-7 h-7 text-white" />
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
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="about" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  About
                </TabsTrigger>
                <TabsTrigger value="schedule" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  Upcoming
                </TabsTrigger>
                <TabsTrigger value="past" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  Past
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md">
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                    Qualification
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{doctor.qualification}</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">About Dr. {doctor.name.split(' ')[1]}</h3>
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                </div>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="mt-6">
                <div className="space-y-3">
                  {availability.map((schedule) => (
                    <div
                      key={schedule.day}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{schedule.day}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{schedule.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Upcoming Appointments Tab */}
              <TabsContent value="upcoming" className="mt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gray-200">
                        <TableHead className="font-bold text-gray-700">Patient</TableHead>
                        <TableHead className="font-bold text-gray-700">Date</TableHead>
                        <TableHead className="font-bold text-gray-700">Time</TableHead>
                        <TableHead className="font-bold text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {upcomingAppointments.map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{appointment.patient}</TableCell>
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
                        <TableHead className="font-bold text-gray-700">Patient</TableHead>
                        <TableHead className="font-bold text-gray-700">Date</TableHead>
                        <TableHead className="font-bold text-gray-700">Time</TableHead>
                        <TableHead className="font-bold text-gray-700">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pastAppointments.map((appointment) => (
                        <TableRow key={appointment.id} className="hover:bg-blue-50/50 transition-colors">
                          <TableCell className="font-semibold text-gray-900">{appointment.patient}</TableCell>
                          <TableCell className="text-gray-700">{appointment.date}</TableCell>
                          <TableCell className="text-gray-700">{appointment.time}</TableCell>
                          <TableCell>{getAppointmentStatusBadge(appointment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-900">{review.patient}</p>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
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

