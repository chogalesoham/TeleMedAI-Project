import { useState } from 'react';
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
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Shield,
  Users,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockDoctors } from '../data/mockData';

export const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = mockDoctors.find((d) => d.id === id) || mockDoctors[0];

  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for additional details
  const education = [
    { degree: 'MD, Cardiology', institution: 'Harvard Medical School', year: '2008' },
    { degree: 'MBBS', institution: 'Johns Hopkins University', year: '2005' },
  ];

  const certifications = [
    'Board Certified in Cardiology',
    'Fellow of American College of Cardiology',
    'Advanced Cardiac Life Support (ACLS)',
    'Nuclear Cardiology Certification',
  ];

  const specializations = [
    'Coronary Artery Disease',
    'Heart Failure Management',
    'Preventive Cardiology',
    'Cardiac Imaging',
  ];

  const workingHours = [
    { day: 'Monday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Tuesday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Thursday', hours: '10:00 AM - 6:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 4:00 PM' },
    { day: 'Saturday', hours: 'Closed' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  const reviews = [
    {
      id: '1',
      patientName: 'John D.',
      rating: 5,
      date: '2024-11-15',
      comment: 'Excellent doctor! Very thorough and caring. Took time to explain everything.',
    },
    {
      id: '2',
      patientName: 'Sarah M.',
      rating: 5,
      date: '2024-11-10',
      comment: 'Highly recommend! Professional and knowledgeable. Made me feel comfortable.',
    },
    {
      id: '3',
      patientName: 'Michael R.',
      rating: 4,
      date: '2024-11-05',
      comment: 'Great experience. Wait time was a bit long but worth it for quality care.',
    },
  ];

  const handleBookAppointment = () => {
    navigate(`/patient-dashboard/appointment-booking`, {
      state: { doctor },
    });
  };

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
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback className="text-2xl">
                    {doctor.name[4]}
                    {doctor.name.split(' ')[1]?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {doctor.name}
                        </h2>
                        {doctor.verified && (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        )}
                      </div>
                      <p className="text-base sm:text-lg text-primary font-medium">
                        {doctor.specialization}
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
                    {doctor.consultationTypes.includes('video') && (
                      <Badge variant="secondary">
                        <Video className="w-3 h-3 mr-1" />
                        Video Consult
                      </Badge>
                    )}
                    {doctor.consultationTypes.includes('in-person') && (
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5" />
                      About
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {doctor.name} is a highly experienced {doctor.specialization.toLowerCase()} with
                      over {doctor.experience} years of practice. Known for providing compassionate care
                      and staying updated with the latest medical advances. Specializes in treating
                      complex cases and helping patients achieve optimal health outcomes.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((spec, index) => (
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
                      <Clock className="w-5 h-5" />
                      Working Hours
                    </h3>
                    <div className="space-y-2">
                      {workingHours.map((schedule, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b last:border-0"
                        >
                          <span className="text-gray-700 font-medium">{schedule.day}</span>
                          <span
                            className={
                              schedule.hours === 'Closed'
                                ? 'text-red-600 font-medium'
                                : 'text-gray-600'
                            }
                          >
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <GraduationCap className="w-5 h-5" />
                      Education
                    </h3>
                    <div className="space-y-4">
                      {education.map((edu, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                            <p className="text-gray-600">{edu.institution}</p>
                            <p className="text-sm text-gray-500">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Certifications
                    </h3>
                    <ul className="space-y-2">
                      {certifications.map((cert, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Experience Highlights
                    </h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Treated over 5,000+ patients successfully
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Published research in leading medical journals
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Regular speaker at medical conferences
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Mentor to young medical professionals
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Patient Reviews
                    </h3>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-xl">{doctor.rating}</span>
                      <span className="text-gray-600">/ 5</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {review.patientName}
                              </p>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    View All Reviews ({doctor.reviewCount})
                  </Button>
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
                  ${doctor.consultationFee}
                </p>
                <p className="text-sm text-gray-500 mt-1">Per session</p>
              </div>

              {/* Quick Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{doctor.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Available: {doctor.availability.join(', ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Next available today</span>
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
