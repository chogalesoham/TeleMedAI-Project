import { useState, useEffect } from 'react';
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
  Loader2,
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
import { AdminService } from '@/services';

export const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchPatientDetails();
    }
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await AdminService.getPatientById(id!);

      if (response.success && response.data) {
        setPatient(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch patient details');
      }
    } catch (err) {
      setError('An error occurred while fetching patient details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        <span className="ml-4 text-lg text-gray-600">Loading patient details...</span>
      </div>
    );
  }

  // Show error state
  if (error || !patient) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/admin/patients')}
          className="flex items-center gap-2 hover:bg-blue-50 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </Button>
        <div className="text-center py-12">
          <p className="text-red-600 font-semibold text-lg">{error || 'Patient not found'}</p>
          <Button onClick={() => navigate('/admin/patients')} className="mt-4">
            Back to Patients List
          </Button>
        </div>
      </div>
    );
  }

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
                  {patient.location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-sm sm:text-base font-medium">
                        {[patient.location.city, patient.location.state, patient.location.country]
                          .filter(Boolean)
                          .join(', ') || 'N/A'}
                      </span>
                    </div>
                  )}
                  {patient.healthProfile?.bloodGroup && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-sm sm:text-base font-medium">
                        Blood Group: {patient.healthProfile.bloodGroup}
                      </span>
                    </div>
                  )}
                  {patient.emergencyContacts?.primaryContact?.phone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <span className="text-sm sm:text-base font-medium">
                        Emergency: {patient.emergencyContacts.primaryContact.phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="text-sm sm:text-base font-medium">
                      Last Visit: {formatDate(patient.lastVisit)}
                    </span>
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
                    Onboarding Status
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    {patient.onboardingCompleted ? 'Complete' : 'Incomplete'}
                  </p>
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
                    Medications
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {patient.currentHealthStatus?.currentMedications?.length || 0}
                  </p>
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
                  <p className="text-xs sm:text-sm text-gray-600 font-semibold uppercase tracking-wide">Allergies</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {patient.currentHealthStatus?.allergies?.length || 0}
                  </p>
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
                  {patient.medicalHistory?.chronicDiseases && patient.medicalHistory.chronicDiseases.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-red-50/30 rounded-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-600" />
                        Chronic Diseases
                      </h3>
                      <div className="space-y-2">
                        {patient.medicalHistory.chronicDiseases.map((disease: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white rounded-lg">
                            <p className="font-semibold text-gray-900">{disease.name}</p>
                            {disease.diagnosedYear && (
                              <p className="text-sm text-gray-600">Diagnosed: {disease.diagnosedYear}</p>
                            )}
                            {disease.notes && <p className="text-sm text-gray-700 mt-1">{disease.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.medicalHistory?.previousSurgeries && patient.medicalHistory.previousSurgeries.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-purple-50/30 rounded-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5 text-purple-600" />
                        Previous Surgeries
                      </h3>
                      <div className="space-y-2">
                        {patient.medicalHistory.previousSurgeries.map((surgery: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white rounded-lg">
                            <p className="font-semibold text-gray-900">{surgery.name}</p>
                            {surgery.year && <p className="text-sm text-gray-600">Year: {surgery.year}</p>}
                            {surgery.notes && <p className="text-sm text-gray-700 mt-1">{surgery.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.medicalHistory?.familyMedicalHistory && patient.medicalHistory.familyMedicalHistory.length > 0 && (
                    <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Family Medical History
                      </h3>
                      <div className="space-y-2">
                        {patient.medicalHistory.familyMedicalHistory.map((history: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white rounded-lg">
                            <p className="font-semibold text-gray-900">{history.condition}</p>
                            {history.relation && <p className="text-sm text-gray-600">Relation: {history.relation}</p>}
                            {history.notes && <p className="text-sm text-gray-700 mt-1">{history.notes}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!patient.medicalHistory || 
                    (!patient.medicalHistory.chronicDiseases?.length && 
                     !patient.medicalHistory.previousSurgeries?.length && 
                     !patient.medicalHistory.familyMedicalHistory?.length)) && (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                      <p className="text-gray-600">No medical history recorded yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Upcoming Appointments Tab */}
              <TabsContent value="upcoming" className="mt-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">Appointment management coming soon.</p>
                </div>
              </TabsContent>

              {/* Past Appointments Tab */}
              <TabsContent value="past" className="mt-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">Past appointments will be displayed here.</p>
                </div>
              </TabsContent>

              {/* Prescriptions Tab */}
              <TabsContent value="prescriptions" className="mt-6">
                <div className="space-y-4">
                  {patient.currentHealthStatus?.currentMedications && 
                   patient.currentHealthStatus.currentMedications.length > 0 ? (
                    patient.currentHealthStatus.currentMedications.map((medication: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 bg-gradient-to-r from-gray-50 to-green-50/30 rounded-xl border border-gray-100 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                              <Pill className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{medication.name}</h4>
                              {medication.prescribedBy && (
                                <p className="text-sm text-gray-600">Prescribed by {medication.prescribedBy}</p>
                              )}
                            </div>
                          </div>
                          {medication.startDate && (
                            <span className="text-sm text-gray-500">{formatDate(medication.startDate)}</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                          {medication.dosage && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Dosage</p>
                              <p className="text-gray-700 font-medium">{medication.dosage}</p>
                            </div>
                          )}
                          {medication.frequency && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Frequency</p>
                              <p className="text-gray-700 font-medium">{medication.frequency}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                      <Pill className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600">No current medications recorded.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Reports Tab */}
              <TabsContent value="reports" className="mt-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">Medical reports will be displayed here.</p>
                  <p className="text-sm text-gray-500 mt-2">Feature coming soon.</p>
                </div>
              </TabsContent>

              {/* AI Reports Tab */}
              <TabsContent value="ai" className="mt-6">
                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <Brain className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-600">AI-powered health insights will be displayed here.</p>
                  <p className="text-sm text-gray-500 mt-2">Feature coming soon.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
