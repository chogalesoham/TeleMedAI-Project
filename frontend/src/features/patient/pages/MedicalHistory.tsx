import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronRight,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  CalendarDays,
  FileText,
  History,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Mock consultation data
interface Consultation {
  id: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorImage: string;
  date: string;
  time: string;
  type: 'video' | 'in-person';
  status: 'completed' | 'upcoming' | 'cancelled';
  notes?: string;
  diagnosis?: string;
  duration?: string;
}

const mockConsultations: Consultation[] = [
  // Future Meetings
  {
    id: 'f1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialization: 'Cardiologist',
    doctorImage: '/doctors/sarah.jpg',
    date: '2025-11-28',
    time: '10:00 AM',
    type: 'video',
    status: 'upcoming',
    notes: 'Follow-up consultation for blood pressure monitoring',
  },
  {
    id: 'f2',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialization: 'General Physician',
    doctorImage: '/doctors/michael.jpg',
    date: '2025-12-05',
    time: '02:30 PM',
    type: 'in-person',
    status: 'upcoming',
    notes: 'Annual health checkup',
  },
  {
    id: 'f3',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialization: 'Dermatologist',
    doctorImage: '/doctors/emily.jpg',
    date: '2025-12-10',
    time: '11:00 AM',
    type: 'video',
    status: 'upcoming',
    notes: 'Skin condition follow-up',
  },
  // Past Meetings
  {
    id: 'p1',
    doctorName: 'Dr. Sarah Johnson',
    doctorSpecialization: 'Cardiologist',
    doctorImage: '/doctors/sarah.jpg',
    date: '2024-11-15',
    time: '03:00 PM',
    type: 'video',
    status: 'completed',
    notes: 'Discussed chest pain symptoms and prescribed medication',
    diagnosis: 'Mild hypertension',
    duration: '25 mins',
  },
  {
    id: 'p2',
    doctorName: 'Dr. Michael Chen',
    doctorSpecialization: 'General Physician',
    doctorImage: '/doctors/michael.jpg',
    date: '2024-11-10',
    time: '10:30 AM',
    type: 'in-person',
    status: 'completed',
    notes: 'Routine checkup, all vitals normal',
    diagnosis: 'Healthy',
    duration: '30 mins',
  },
  {
    id: 'p3',
    doctorName: 'Dr. Emily Rodriguez',
    doctorSpecialization: 'Dermatologist',
    doctorImage: '/doctors/emily.jpg',
    date: '2024-10-28',
    time: '02:00 PM',
    type: 'video',
    status: 'completed',
    notes: 'Skin allergy treatment prescribed',
    diagnosis: 'Contact dermatitis',
    duration: '20 mins',
  },
  {
    id: 'p4',
    doctorName: 'Dr. James Wilson',
    doctorSpecialization: 'Neurologist',
    doctorImage: '/doctors/james.jpg',
    date: '2024-10-15',
    time: '09:00 AM',
    type: 'in-person',
    status: 'completed',
    notes: 'Headache consultation, recommended lifestyle changes',
    diagnosis: 'Tension headaches',
    duration: '35 mins',
  },
  {
    id: 'p5',
    doctorName: 'Dr. Lisa Anderson',
    doctorSpecialization: 'Pediatrician',
    doctorImage: '/doctors/lisa.jpg',
    date: '2024-09-20',
    time: '11:30 AM',
    type: 'video',
    status: 'cancelled',
    notes: 'Patient cancelled due to travel',
  },
  {
    id: 'p6',
    doctorName: 'Dr. Robert Taylor',
    doctorSpecialization: 'Orthopedic Surgeon',
    doctorImage: '/doctors/robert.jpg',
    date: '2024-09-05',
    time: '04:00 PM',
    type: 'in-person',
    status: 'completed',
    notes: 'Knee pain evaluation, physiotherapy recommended',
    diagnosis: 'Mild arthritis',
    duration: '40 mins',
  },
];

const MedicalHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Separate consultations into future and past
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureConsultations = mockConsultations
    .filter(c => new Date(c.date) >= today && c.status === 'upcoming')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastConsultations = mockConsultations
    .filter(c => new Date(c.date) < today || c.status !== 'upcoming')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Filter based on search
  const filterConsultations = (consultations: Consultation[]) => {
    return consultations.filter(c =>
      c.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.doctorSpecialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredFuture = filterConsultations(futureConsultations);
  const filteredPast = filterConsultations(pastConsultations);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'upcoming':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleConsultationClick = (consultation: Consultation) => {
    // Navigate to consultation summary page
    navigate('/patient-dashboard/consultation-summary', {
      state: { consultation },
    });
  };

  const ConsultationCard = ({ consultation }: { consultation: Consultation }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary"
        onClick={() => handleConsultationClick(consultation)}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex gap-4">
            {/* Doctor Avatar */}
            <Avatar className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              <AvatarImage src={consultation.doctorImage} />
              <AvatarFallback>
                {consultation.doctorName[4]}
                {consultation.doctorName.split(' ')[1]?.[0]}
              </AvatarFallback>
            </Avatar>

            {/* Consultation Details */}
            <div className="flex-1 min-w-0">
              {/* Doctor Info */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                    {consultation.doctorName}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Stethoscope className="w-3.5 h-3.5" />
                    {consultation.doctorSpecialization}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`${getStatusColor(consultation.status)} flex items-center gap-1 text-xs font-medium`}
                >
                  {getStatusIcon(consultation.status)}
                  {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                </Badge>
              </div>

              {/* Date, Time, Type */}
              <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(consultation.date)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{consultation.time}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  {consultation.type === 'video' ? (
                    <>
                      <Video className="w-3 h-3" />
                      Video Call
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3" />
                      In-Person
                    </>
                  )}
                </Badge>
                {consultation.duration && (
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{consultation.duration}</span>
                  </div>
                )}
              </div>

              {/* Notes/Diagnosis */}
              {consultation.notes && (
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  <span className="font-medium">Notes:</span> {consultation.notes}
                </p>
              )}
              {consultation.diagnosis && (
                <p className="text-sm text-primary font-medium">
                  Diagnosis: {consultation.diagnosis}
                </p>
              )}

              {/* View Details Arrow */}
              <div className="flex items-center justify-end mt-3 text-primary">
                <span className="text-sm font-medium mr-1">View Details</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          My Consultations
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          View all your past and upcoming doctor consultations
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by doctor name, specialization, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredFuture.length}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredPast.filter(c => c.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <History className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredFuture.length + filteredPast.length}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for All, Future, Past */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All Consultations
          </TabsTrigger>
          <TabsTrigger value="future" className="text-xs sm:text-sm">
            Upcoming ({filteredFuture.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="text-xs sm:text-sm">
            Past ({filteredPast.length})
          </TabsTrigger>
        </TabsList>

        {/* All Consultations Tab */}
        <TabsContent value="all" className="space-y-6">
          {/* Future Meetings Section */}
          {filteredFuture.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Future Scheduled Meetings
                </h2>
                <Badge variant="secondary">{filteredFuture.length}</Badge>
              </div>
              <div className="space-y-3">
                {filteredFuture.map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            </div>
          )}

          {/* Past Meetings Section */}
          {filteredPast.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Past Meetings</h2>
                <Badge variant="secondary">{filteredPast.length}</Badge>
              </div>
              <div className="space-y-3">
                {filteredPast.map((consultation) => (
                  <ConsultationCard key={consultation.id} consultation={consultation} />
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredFuture.length === 0 && filteredPast.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No consultations found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'You have no consultations yet'}
                </p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Future Only Tab */}
        <TabsContent value="future" className="space-y-3">
          {filteredFuture.length > 0 ? (
            filteredFuture.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No upcoming consultations
                </h3>
                <p className="text-gray-600 mb-4">
                  Schedule a consultation with a doctor to see it here
                </p>
                <Button onClick={() => navigate('/patient-dashboard/doctor-selection')}>
                  Find a Doctor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Past Only Tab */}
        <TabsContent value="past" className="space-y-3">
          {filteredPast.length > 0 ? (
            filteredPast.map((consultation) => (
              <ConsultationCard key={consultation.id} consultation={consultation} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No past consultations
                </h3>
                <p className="text-gray-600">
                  Your completed consultations will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { MedicalHistory };
export default MedicalHistory;
