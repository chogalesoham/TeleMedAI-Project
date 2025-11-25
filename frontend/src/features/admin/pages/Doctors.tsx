import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCog, Search, Filter, MoreVertical, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const Doctors = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      email: 'sarah.j@hospital.com',
      phone: '+1 234-567-8901',
      status: 'active',
      patients: 145,
      rating: 4.8,
      joinDate: '2023-01-15',
    },
    {
      id: 2,
      name: 'Dr. Michael Brown',
      specialty: 'Dermatology',
      email: 'michael.b@hospital.com',
      phone: '+1 234-567-8902',
      status: 'active',
      patients: 132,
      rating: 4.9,
      joinDate: '2023-02-20',
    },
    {
      id: 3,
      name: 'Dr. Emily Davis',
      specialty: 'Pediatrics',
      email: 'emily.d@hospital.com',
      phone: '+1 234-567-8903',
      status: 'pending',
      patients: 0,
      rating: 0,
      joinDate: '2024-01-10',
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      email: 'james.w@hospital.com',
      phone: '+1 234-567-8904',
      status: 'active',
      patients: 98,
      rating: 4.7,
      joinDate: '2023-06-12',
    },
    {
      id: 5,
      name: 'Dr. Lisa Anderson',
      specialty: 'Neurology',
      email: 'lisa.a@hospital.com',
      phone: '+1 234-567-8905',
      status: 'inactive',
      patients: 67,
      rating: 4.6,
      joinDate: '2023-08-05',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-7 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <UserCog className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            Doctors Management
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base font-medium">Manage and monitor all doctors</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg font-semibold h-11 px-6">
          + Add New Doctor
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Total Doctors</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">147</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                  <UserCog className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Active</p>
                  <p className="text-2xl sm:text-3xl font-bold text-green-700 mt-1">134</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-yellow-700 mt-1">12</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-md">
                  <XCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-yellow-50/50">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Avg Rating</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">4.7</p>
                </div>
                <div className="text-yellow-500 text-3xl sm:text-4xl drop-shadow-lg">★</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search by name, specialty, or email..."
                  className="pl-11 h-11 rounded-xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 h-11 px-5 rounded-xl font-semibold hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Doctors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
          <CardHeader className="border-b border-gray-100 pb-5">
            <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">
              All Doctors ({filteredDoctors.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-gray-200">
                    <TableHead className="font-bold text-gray-700">Name</TableHead>
                    <TableHead className="font-bold text-gray-700">Specialty</TableHead>
                    <TableHead className="font-bold text-gray-700 hidden lg:table-cell">Contact</TableHead>
                    <TableHead className="font-bold text-gray-700 hidden sm:table-cell">Patients</TableHead>
                    <TableHead className="font-bold text-gray-700 hidden sm:table-cell">Rating</TableHead>
                    <TableHead className="font-bold text-gray-700">Status</TableHead>
                    <TableHead className="font-bold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id} className="hover:bg-blue-50/50 transition-colors border-gray-100">
                      <TableCell className="font-semibold text-gray-900">{doctor.name}</TableCell>
                      <TableCell className="text-gray-700">{doctor.specialty}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{doctor.email}</div>
                          <div className="text-gray-500 mt-0.5">{doctor.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell font-semibold text-gray-800">{doctor.patients}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className="text-yellow-500 text-lg">★</span>
                          <span className="text-gray-900">{doctor.rating || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(doctor.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="hover:bg-blue-100 h-9 w-9 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/admin/doctors/${doctor.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              Suspend
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
