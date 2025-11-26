import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  Award,
  Languages,
  Clock,
  Video,
  CheckCircle,
  Calendar,
  DollarSign,
  Shield,
  Briefcase,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PatientService from '@/services/patient.service';
import { toast } from 'sonner';

interface Doctor {
  id: string;
  name: string;
  profilePicture: string;
  specialties: string[];
  languages: string[];
  consultationModes: string[];
  consultationFee: {
    currency: string;
    amount: number;
    mode: string;
  };
  shortBio: string;
  rating: number;
  reviewCount: number;
  experience: number;
  availability: any[];
  registrationNumber: string;
  registrationCouncil: string;
}

export const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchDoctorDetails();
    }
  }, [id]);

  const fetchDoctorDetails = async () => {
    setIsLoading(true);
    try {
      const response = await PatientService.getDoctorById(id!);
      if (response.success && response.data) {
        setDoctor(response.data);
      } else {
        toast.error(response.error || 'Failed to load doctor details');
        navigate('/patient-dashboard/doctor-selection');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor details');
      navigate('/patient-dashboard/doctor-selection');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate(`/patient-dashboard/appointment-booking`, {
      state: { doctor },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Doctor not found</p>
        <Button onClick={() => navigate('/patient-dashboard/doctor-selection')} className="mt-4">
          Back to Doctor Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/patient-dashboard/doctor-selection')}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Doctor Profile
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">Complete information and booking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Doctor Header Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0">
                  <AvatarImage src={doctor.profilePicture} />
                  <AvatarFallback className="text-2xl">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {doctor.name}
                        </h2>
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <p className="text-base sm:text-lg text-primary font-medium">
                        {doctor.specialties[0] || 'General Practice'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold">{doctor.rating}</span>
                      <span className="text-sm text-gray-600">
                        ({doctor.reviewCount} reviews)
                      </span>
                    </div>
                    <Separator orientation="vertical" className="h-4 hidden sm:block" />
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm">{doctor.experience} years exp.</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                    {doctor.consultationModes.includes('tele') && (
                      <Badge variant="secondary">
                        <Video className="w-3 h-3 mr-1" />
                        Video Consult
                      </Badge>
                    )}
                    {doctor.consultationModes.includes('in_person') && (
                      <Badge variant="secondary">
                        <MapPin className="w-3 h-3 mr-1" />
                        In-Person
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Languages className="w-3 h-3 mr-1" />
                      {doctor.languages.length} Languages
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Section */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      About
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {doctor.shortBio || `${doctor.name} is a highly experienced ${doctor.specialties[0]?.toLowerCase() || 'healthcare professional'} with over ${doctor.experience} years of practice. Known for providing compassionate care and staying updated with the latest medical advances.`}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((spec, index) => (
                        <Badge key={index} variant="outline">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Languages Spoken
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((lang, index) => (
                        <Badge key={index} variant="secondary">
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Registration Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Number:</span>
                        <span className="font-medium">{doctor.registrationNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Council:</span>
                        <span className="font-medium">{doctor.registrationCouncil}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Professional Experience
                    </h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{doctor.experience} Years of Practice</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Specialized in {doctor.specialties.join(', ')}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">Verified Professional</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Registered with {doctor.registrationCouncil}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Consultation Modes
                    </h3>
                    <div className="space-y-2">
                      {doctor.consultationModes.map((mode, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-gray-700 capitalize">{mode.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Book Appointment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Consultation Fee */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary mt-1">
                  {doctor.consultationFee.currency} {doctor.consultationFee.amount}
                </p>
                <p className="text-sm text-gray-500 mt-1">Per {doctor.consultationFee.mode.replace('_', ' ')}</p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Languages className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{doctor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {doctor.availability.length > 0 ? 'Available' : 'Check availability'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Verified Professional</span>
                </div>
              </div>

              <Separator />

              {/* Book Appointment Button */}
              <Button
                onClick={handleBookAppointment}
                size="lg"
                className="w-full"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment
              </Button>

              <div className="text-center">
                <Button variant="outline" className="w-full" onClick={() => navigate('/patient-dashboard/ai-chatbot')}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </div>

              {/* Additional Info */}
              <div className="text-xs text-gray-500 text-center pt-2">
                <p>Free cancellation up to 24 hours before appointment</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
