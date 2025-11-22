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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ConsultationSummary = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const consultation = {
    id: 'CONS-2024-001',
    date: new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    time: '10:30 AM',
    duration: '25 minutes',
    type: 'Video Consultation',
    doctor: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      image: '/doctors/sarah.jpg'
    },
    diagnosis: 'Mild Hypertension (Stage 1)',
    symptoms: ['Headache', 'Fatigue', 'Dizziness'],
    vitalSigns: {
      bloodPressure: '142/90 mmHg',
      heartRate: '78 bpm',
      temperature: '98.6°F',
      weight: '165 lbs'
    },
    prescriptions: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in the morning with water'
      },
      {
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take with food'
      }
    ],
    recommendations: [
      'Reduce sodium intake to less than 2,300mg per day',
      'Exercise for at least 30 minutes, 5 days a week',
      'Monitor blood pressure daily at home',
      'Schedule follow-up appointment in 4 weeks',
      'Maintain a healthy weight (target: 155 lbs)'
    ],
    labTests: [
      'Complete Blood Count (CBC)',
      'Lipid Panel',
      'Basic Metabolic Panel'
    ],
    notes: 'Patient reports improvement in symptoms over the past week. Continue current medication regimen. Consider increasing dosage if blood pressure remains elevated at next visit.'
  };

  const timeline = [
    { time: '10:30 AM', event: 'Consultation Started', status: 'completed' },
    { time: '10:35 AM', event: 'Symptoms Discussion', status: 'completed' },
    { time: '10:42 AM', event: 'Physical Assessment', status: 'completed' },
    { time: '10:50 AM', event: 'Diagnosis & Treatment Plan', status: 'completed' },
    { time: '10:55 AM', event: 'Consultation Ended', status: 'completed' }
  ];

  return (
    <div className="mx-auto space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Consultation Completed Successfully!</h1>
            <p className="text-gray-600">
              Your consultation summary is ready. You can download or share it anytime.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Consultation Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Consultation Details</h2>
                  <p className="text-sm text-gray-600">ID: {consultation.id}</p>
                </div>
                <Badge>{consultation.type}</Badge>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={consultation.doctor.image} />
                  <AvatarFallback>{consultation.doctor.name[4]}{consultation.doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{consultation.doctor.name}</h3>
                  <p className="text-sm text-gray-600">{consultation.doctor.specialization}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {consultation.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {consultation.time} ({consultation.duration})
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Diagnosis */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Diagnosis
                </h3>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900">{consultation.diagnosis}</p>
                </div>
              </div>

              {/* Reported Symptoms */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Reported Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {consultation.symptoms.map((symptom) => (
                    <Badge key={symptom} variant="secondary">{symptom}</Badge>
                  ))}
                </div>
              </div>

              {/* Vital Signs */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Vital Signs</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(consultation.vitalSigns).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="font-semibold text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Prescriptions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-primary" />
                  Prescriptions
                </h3>
                <div className="space-y-3">
                  {consultation.prescriptions.map((med, index) => (
                    <motion.div
                      key={med.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{med.name}</h4>
                          <p className="text-sm text-gray-600">{med.dosage} - {med.frequency}</p>
                        </div>
                        <Badge variant="outline">{med.duration}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {med.instructions}
                      </p>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-4" onClick={() => navigate('/patient-dashboard/medications')}>
                  View All Medications
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              {/* Recommendations */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Doctor's Recommendations</h3>
                <ul className="space-y-2">
                  {consultation.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Lab Tests */}
              {consultation.labTests.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Recommended Lab Tests</h3>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <ul className="space-y-1">
                      {consultation.labTests.map((test) => (
                        <li key={test} className="text-sm text-amber-900">• {test}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Doctor's Notes */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Doctor's Notes</h3>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-700 text-sm leading-relaxed">{consultation.notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Consultation */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Rate Your Consultation</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
                  )}
                </div>
                <Textarea
                  placeholder="Share your feedback about this consultation (optional)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button disabled={rating === 0}>
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Consultation Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      {index < timeline.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-sm text-gray-900">{item.event}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>
              <div className="space-y-3">
                <Button 
                  variant="default" 
                  className="w-full justify-between"
                  onClick={() => navigate('/patient-dashboard/book-appointment')}
                >
                  <span>Book Follow-up</span>
                  <Calendar className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate('/patient-dashboard/medications')}
                >
                  <span>Set Reminders</span>
                  <Pill className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => navigate('/patient-dashboard/chatbot')}
                >
                  <span>Ask AI Questions</span>
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Have questions about your consultation or prescription?
              </p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/patient-dashboard/support')}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
