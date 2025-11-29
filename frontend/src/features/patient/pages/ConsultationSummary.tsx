import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  Share2,
  Calendar,
  Clock,
  FileText,
  Pill,
  AlertCircle,
  MessageSquare,
  ArrowRight,
  Star
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ConsultationService from '@/services/consultation.service';
import { Loader2 } from 'lucide-react';

export const ConsultationSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const consultationId = searchParams.get('consultationId');

  const [consultationData, setConsultationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchConsultation = async () => {
      if (!consultationId) {
        setError('No consultation ID provided');
        setIsLoading(false);
        return;
      }

      try {
        const response = await ConsultationService.getConsultationResult(consultationId);
        if (response.success && response.data) {
          setConsultationData(response.data);
        } else {
          // Fallback to state data if fetch fails
          if (location.state?.consultationData) {
            setConsultationData({
              ...location.state.consultationData,
              appointment: {
                _id: consultationId,
                doctor: { name: 'Doctor', specialization: 'Specialist' },
                appointmentDate: new Date()
              },
              createdAt: new Date()
            });
          } else {
            setError(response.error || 'Failed to load consultation details');
          }
        }
      } catch (err) {
        console.error('Error loading consultation:', err);
        setError('An error occurred while loading the consultation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultation();
  }, [consultationId, location.state]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading consultation summary...</span>
      </div>
    );
  }

  if (error || !consultationData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Summary</h2>
        <p className="text-gray-600 mb-4">{error || 'Consultation data not found'}</p>
        <Button onClick={() => navigate('/patient-dashboard')}>Return to Dashboard</Button>
      </div>
    );
  }

  // Map backend data to UI structure
  const doctorName = consultationData.appointment?.doctor?.name || 'Doctor';
  const doctorSpec = consultationData.appointment?.doctor?.specialization || 'Specialist';
  const doctorImage = consultationData.appointment?.doctor?.profilePicture || '/doctors/default.jpg';
  const consultDate = new Date(consultationData.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const consultTime = new Date(consultationData.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const consultation = {
    id: consultationData.appointment?._id || consultationId,
    date: consultDate,
    time: consultTime,
    duration: '25 minutes',
    type: 'Video Consultation',
    doctor: {
      name: doctorName,
      specialization: doctorSpec,
      image: doctorImage
    },
    diagnosis: consultationData.summary?.diagnosis_discussed || 'Not recorded',
    symptoms: consultationData.summary?.key_symptoms || [],
    vitalSigns: {
      bloodPressure: 'Not recorded',
      heartRate: 'Not recorded',
      temperature: 'Not recorded',
      weight: 'Not recorded'
    },
    prescriptions: consultationData.prescription?.medicines?.map((med: any) => ({
      name: med.name,
      dosage: med.dosage,
      frequency: typeof med.frequency === 'string' ? med.frequency : 'As directed',
      duration: med.duration_days ? `${med.duration_days} days` : 'As directed',
      instructions: med.instructions
    })) || [],
    recommendations: [
      ...(consultationData.summary?.follow_up_instructions || []),
      ...(consultationData.prescription?.additional_instructions || [])
    ],
    labTests: [],
    notes: consultationData.summary?.patient_summary || consultationData.summary?.doctor_summary || 'No notes available.'
  };

  const timeline = [
    { time: '10:30 AM', event: 'Consultation Started', status: 'completed' },
    { time: '10:35 AM', event: 'Symptoms Discussion', status: 'completed' },
    { time: '10:42 AM', event: 'Physical Assessment', status: 'completed' },
    { time: '10:50 AM', event: 'Diagnosis & Treatment Plan', status: 'completed' },
    { time: '10:55 AM', event: 'Consultation Ended', status: 'completed' }
  ];

  return (
    <div className="mx-auto space-y-4 sm:space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 sm:p-5 md:p-6"
      >
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">Consultation Completed Successfully!</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Your consultation summary is ready. You can download or share it anytime.
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Download PDF</span>
              <span className="xs:hidden">PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Consultation Info */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4 sm:mb-6">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2 truncate">Consultation Details</h2>
                  <p className="text-xs sm:text-sm text-gray-600">ID: {consultation.id}</p>
                </div>
                <Badge className="text-xs w-fit">{consultation.type}</Badge>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Avatar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                  <AvatarImage src={consultation.doctor.image} />
                  <AvatarFallback className="text-xs sm:text-sm">{consultation.doctor.name[4]}{consultation.doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{consultation.doctor.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{consultation.doctor.specialization}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{consultation.date}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">{consultation.time} ({consultation.duration})</span>
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-4 sm:my-6" />

              {/* Diagnosis */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  Diagnosis
                </h3>
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm sm:text-base font-medium text-blue-900">{consultation.diagnosis}</p>
                </div>
              </div>

              {/* Reported Symptoms */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Reported Symptoms</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {consultation.symptoms.map((symptom) => (
                    <Badge key={symptom} variant="secondary" className="text-xs">{symptom}</Badge>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Vital Signs</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {Object.entries(consultation.vitalSigns).map(([key, value]) => (
                    <div key={key} className="p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs sm:text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-sm sm:text-base font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4 sm:my-6" />

              {/* Prescriptions */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                  Prescriptions
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {consultation.prescriptions.map((med, index) => (
                    <motion.div
                      key={med.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{med.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                        </div>
                        <Badge variant="outline" className="text-xs w-fit">{med.duration}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 flex items-start gap-1.5 sm:gap-2">
                        <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                        <span>{med.instructions}</span>
                      </p>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-3 sm:mt-4 text-sm" onClick={() => navigate('/patient-dashboard/medications')}>
                  View All Medications
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2" />
                </Button>
              </div>

              {/* Recommendations */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Doctor's Recommendations</h3>
                <ul className="space-y-1.5 sm:space-y-2">
                  {consultation.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-gray-700">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Lab Tests */}
              {consultation.labTests.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Recommended Lab Tests</h3>
                  <div className="p-3 sm:p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <ul className="space-y-0.5 sm:space-y-1">
                      {consultation.labTests.map((test) => (
                        <li key={test} className="text-xs sm:text-sm text-amber-900">• {test}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Doctor's Notes */}
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Doctor's Notes</h3>
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{consultation.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Consultation */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Rate Your Consultation</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110 touch-manipulation"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                          }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-600">({rating}/5)</span>
                  )}
                </div>
                <Textarea
                  placeholder="Share your feedback about this consultation (optional)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm"
                />
                <Button disabled={rating === 0} className="w-full text-sm">
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Timeline */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Consultation Timeline</h3>
              <div className="space-y-3 sm:space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-2 sm:gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-6 sm:h-8 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3 sm:pb-4 min-w-0">
                      <p className="font-medium text-xs sm:text-sm text-gray-900 truncate">{item.event}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Next Steps</h3>
              <div className="space-y-2 sm:space-y-3">
                <Button
                  variant="default"
                  className="w-full justify-between text-sm h-10 sm:h-11"
                  onClick={() => navigate('/patient-dashboard/book-appointment')}
                >
                  <span>Book Follow-up</span>
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm h-10 sm:h-11"
                  onClick={() => navigate('/patient-dashboard/medications')}
                >
                  <span>Set Reminders</span>
                  <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between text-sm h-10 sm:h-11"
                  onClick={() => navigate('/patient-dashboard/chatbot')}
                >
                  <span>Ask AI Questions</span>
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3">Need Help?</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Have questions about your consultation or prescription?
              </p>
              <Button variant="outline" className="w-full text-sm h-10 sm:h-11" onClick={() => navigate('/patient-dashboard/support')}>
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
