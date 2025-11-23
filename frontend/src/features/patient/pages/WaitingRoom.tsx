import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  Users,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

export const WaitingRoom = () => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes in seconds
  const [queuePosition, setQueuePosition] = useState(2);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/patient-dashboard/consultation');
          return 0;
        }
        return prev - 1;
      });

      // Simulate queue movement
      if (timeRemaining === 120 && queuePosition > 1) {
        setQueuePosition(1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, queuePosition, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((180 - timeRemaining) / 180) * 100;

  const doctor = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    image: '/doctors/sarah.jpg',
    rating: 4.9
  };

  const checklist = [
    { label: 'System Check Complete', done: true },
    { label: 'Camera & Microphone Ready', done: true },
    { label: 'Connection Stable', done: true },
    { label: 'Doctor Preparing', done: queuePosition === 1 },
    { label: 'Starting Soon', done: false }
  ];

  return (
    <div className="mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">Virtual Waiting Room</h1>
        <p className="text-sm sm:text-base text-gray-600">Please wait while we connect you with your doctor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Timer Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-blue-50 border-primary/20">
            <CardContent className="p-4 sm:p-6 md:p-8 text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-white shadow-lg mb-3 sm:mb-4">
                  <Clock className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-1.5 sm:mb-2">{formatTime(timeRemaining)}</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Estimated wait time</p>
                <Progress value={progress} className="h-1.5 sm:h-2 mb-1.5 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-500 px-2">Consultation will start automatically</p>
              </motion.div>
            </CardContent>
          </Card>

          {/* Queue Position */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">Your Position in Queue</h3>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">We'll notify you when it's your turn</p>
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="text-3xl sm:text-4xl font-bold text-primary">{queuePosition}</div>
                  <p className="text-xs sm:text-sm text-gray-600">in line</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Animated Illustration */}
          <Card>
            <CardContent className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px]">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-primary/20 to-blue-200 flex items-center justify-center">
                    <Video className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-primary/20 -z-10"
                  />
                </motion.div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mt-4 sm:mt-5 md:mt-6 mb-1.5 sm:mb-2 text-center px-4">
                  Preparing Your Consultation
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center max-w-md px-4">
                  Your doctor is reviewing your medical history and will be with you shortly
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pre-Consultation Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-1.5 sm:mb-2">Tips for a Better Consultation</h3>
                  <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span>Find a quiet, well-lit space for the video call</span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span>Keep your medical records and current medications handy</span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span>Prepare a list of questions you want to ask</span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                      <span>Have a pen and paper ready to take notes</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Doctor Info */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Your Doctor</h3>
              <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <Avatar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0">
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback>{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{doctor.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{doctor.specialization}</p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {doctor.rating} ⭐
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <p>Dr. Johnson specializes in cardiology with 15 years of experience.</p>
              </div>
            </CardContent>
          </Card>

          {/* System Checklist */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">System Status</h3>
              <div className="space-y-2 sm:space-y-3">
                {checklist.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2 sm:gap-3"
                  >
                    {item.done ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span className={`text-xs sm:text-sm ${item.done ? 'text-gray-900' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Need Help?</h3>
              <div className="space-y-2 sm:space-y-3">
                <Button variant="outline" className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm" size="sm">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Chat with Support</span>
                </Button>
                <Button variant="outline" className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm" size="sm">
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">View Medical History</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-9 sm:h-10 text-xs sm:text-sm text-red-600 hover:text-red-700" 
                  size="sm"
                  onClick={() => navigate('/patient-dashboard')}
                >
                  <span className="truncate">Cancel Appointment</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
