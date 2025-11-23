import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Clock, 
  FileText,
  Users,
  ArrowRight,
  Download,
  Share2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface PossibleCondition {
  name: string;
  probability: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
  commonTreatments: string[];
}

const mockConditions: PossibleCondition[] = [
  {
    name: 'Common Cold',
    probability: 78,
    severity: 'low',
    description: 'A viral infection of the upper respiratory tract, typically resolving within 7-10 days.',
    commonTreatments: ['Rest', 'Fluids', 'Over-the-counter pain relievers', 'Decongestants']
  },
  {
    name: 'Seasonal Flu',
    probability: 65,
    severity: 'medium',
    description: 'Influenza infection causing fever, body aches, and respiratory symptoms.',
    commonTreatments: ['Antiviral medications', 'Rest', 'Fluids', 'Pain relievers']
  },
  {
    name: 'Acute Sinusitis',
    probability: 42,
    severity: 'medium',
    description: 'Inflammation of the sinuses, often following a cold or allergic reaction.',
    commonTreatments: ['Nasal decongestants', 'Saline rinses', 'Pain relievers', 'Antibiotics if bacterial']
  }
];

const recommendations = [
  {
    title: 'Stay Hydrated',
    description: 'Drink at least 8-10 glasses of water daily',
    icon: CheckCircle2,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    title: 'Get Adequate Rest',
    description: 'Aim for 7-8 hours of sleep per night',
    icon: Clock,
    color: 'text-purple-600',
    bg: 'bg-purple-100'
  },
  {
    title: 'Monitor Symptoms',
    description: 'Keep track of any changes in your condition',
    icon: TrendingUp,
    color: 'text-green-600',
    bg: 'bg-green-100'
  }
];

const suggestedSpecialists = [
  { name: 'General Physician', count: 12 },
  { name: 'ENT Specialist', count: 8 },
  { name: 'Pulmonologist', count: 5 }
];

export const PreDiagnosis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { symptoms, description, duration, severity } = location.state || {};

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] px-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-primary border-t-transparent rounded-full"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-3 sm:mt-4 text-base sm:text-lg font-medium text-gray-700 text-center"
        >
          AI is analyzing your symptoms...
        </motion.p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2 text-center">This usually takes a few seconds</p>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">AI Pre-Diagnosis Report</h1>
          <p className="text-sm sm:text-base text-gray-600">Based on your symptoms, here's what our AI suggests</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
            <span className="sm:hidden">Save</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm h-8 sm:h-9">
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Important Notice */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-semibold text-amber-900 text-sm sm:text-base">Important Notice</h3>
              <p className="text-xs sm:text-sm text-amber-800 mt-1">
                This is an AI-generated preliminary assessment and should not replace professional medical advice. 
                Please consult with a healthcare provider for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Symptoms Summary */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Your Reported Symptoms</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-sm sm:text-base">{duration || '2 days'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Severity</p>
                    <Badge variant={severity === 'severe' ? 'destructive' : severity === 'moderate' ? 'default' : 'secondary'} className="text-xs">
                      {severity || 'Moderate'}
                    </Badge>
                  </div>
                </div>
                {symptoms && symptoms.length > 0 && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">Symptoms</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {symptoms.map((symptom: string) => (
                        <Badge key={symptom} variant="outline" className="text-xs">{symptom}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {description && (
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Description</p>
                    <p className="text-xs sm:text-sm text-gray-900 bg-gray-50 p-2.5 sm:p-3 rounded-lg">{description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Possible Conditions */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Possible Conditions</h3>
              <div className="space-y-3 sm:space-y-4">
                {mockConditions.map((condition, index) => (
                  <motion.div
                    key={condition.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between mb-2 sm:mb-3 gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{condition.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{condition.description}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={
                          condition.severity === 'high' ? 'destructive' : 
                          condition.severity === 'medium' ? 'default' : 
                          'secondary'
                        } className="text-xs">
                          {condition.severity}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-2 sm:mb-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                        <span className="text-gray-600">Match Probability</span>
                        <span className="font-semibold">{condition.probability}%</span>
                      </div>
                      <Progress value={condition.probability} className="h-1.5 sm:h-2" />
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">Common Treatments:</p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {condition.commonTreatments.map((treatment) => (
                          <Badge key={treatment} variant="outline" className="text-xs">
                            {treatment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">AI Recommendations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-3 sm:p-4 text-center"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${rec.bg} flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                      <rec.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${rec.color}`} />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{rec.title}</h4>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Next Steps */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Next Steps</h3>
              <div className="space-y-2 sm:space-y-3">
                <Button 
                  className="w-full justify-between h-9 sm:h-10 text-sm" 
                  onClick={() => navigate('/patient-dashboard/doctors')}
                >
                  <span>Find a Doctor</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-9 sm:h-10 text-sm"
                  onClick={() => navigate('/patient-dashboard/book-appointment')}
                >
                  <span>Book Appointment</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-9 sm:h-10 text-sm"
                  onClick={() => navigate('/patient-dashboard/chatbot')}
                >
                  <span>Ask AI Questions</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Specialists */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Suggested Specialists</h3>
              <div className="space-y-2 sm:space-y-3">
                {suggestedSpecialists.map((specialist) => (
                  <div key={specialist.name} className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm truncate">{specialist.name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">{specialist.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Info */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start gap-2 sm:gap-3">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">About This Report</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    This report was generated using advanced AI algorithms analyzing thousands of 
                    medical cases. Accuracy: 85-90% for common conditions.
                  </p>
                  <p className="text-xs text-gray-500 mt-2 sm:mt-3">
                    Generated on {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
