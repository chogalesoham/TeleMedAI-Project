import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff,
  Maximize,
  MessageSquare,
  FileText,
  Clock,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const LiveConsultation = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [notes, setNotes] = useState('');
  const [duration, setDuration] = useState(0);
  const [aiInsights, setAiInsights] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);

    // Simulate AI insights appearing during consultation
    const insightsTimer = setTimeout(() => {
      setAiInsights([
        'Patient mentions persistent headaches - consider migraine assessment',
        'Blood pressure readings within normal range',
        'Recommend follow-up in 2 weeks'
      ]);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(insightsTimer);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigate('/patient-dashboard/consultation-summary');
  };

  const doctor = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    image: '/doctors/sarah.jpg'
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-3 sm:space-y-4">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border border-red-200 rounded-lg p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Left Section - Title & Status */}
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Live Consultation</h1>
              <Badge variant="destructive" className="animate-pulse text-xs font-semibold">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white mr-1.5 sm:mr-2 animate-pulse" />
                LIVE
              </Badge>
            </div>
            
            {/* Doctor Info Row */}
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white shadow-sm">
                <AvatarImage src={doctor.image} />
                <AvatarFallback className="text-xs sm:text-sm">{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm sm:text-base font-semibold text-gray-900">{doctor.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{doctor.specialization}</p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-900">{formatDuration(duration)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-600">Connection:</span>
                <span className="font-semibold text-green-700">Excellent</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="font-semibold text-primary">AI Assistant Active</span>
              </div>
            </div>
          </div>

          {/* Right Section - Quick Actions */}
          <div className="flex sm:flex-col gap-2 sm:items-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => {/* Toggle fullscreen */}}
            >
              <Maximize className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Fullscreen</span>
              <span className="sm:hidden">Full</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => {/* Share screen */}}
            >
              <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Chat</span>
              <span className="sm:hidden">Chat</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 min-h-0">
        {/* Video Section */}
        <div className="lg:col-span-2 flex flex-col gap-3 sm:gap-4">
          {/* Doctor Video (Large) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden min-h-[300px] sm:min-h-[400px]"
          >
            {/* Placeholder for video stream */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center px-4">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 border-2 sm:border-4 border-white/20">
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback>{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-white text-base sm:text-lg md:text-xl font-semibold truncate">{doctor.name}</h3>
                <p className="text-gray-300 text-sm sm:text-base truncate">{doctor.specialization}</p>
              </div>
            </div>

            {/* Patient Video (Small - Picture in Picture) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 md:bottom-4 md:right-4 w-24 h-20 sm:w-32 sm:h-24 md:w-48 md:h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                {isVideoOff ? (
                  <div className="text-center">
                    <VideoOff className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white mx-auto mb-1 sm:mb-2" />
                    <p className="text-white text-xs sm:text-sm">Camera Off</p>
                  </div>
                ) : (
                  <div className="text-white text-xs sm:text-sm">You</div>
                )}
              </div>
            </motion.div>

            {/* Connection Quality Indicator */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4">
              <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Excellent Connection</span>
                <span className="sm:hidden">Excellent</span>
              </Badge>
            </div>

            {/* Fullscreen Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
            >
              <Maximize className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </motion.div>

          {/* Call Controls */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  variant={isMuted ? 'destructive' : 'outline'}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />}
                </Button>
                
                <Button
                  size="lg"
                  variant={isVideoOff ? 'destructive' : 'outline'}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" /> : <Video className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />}
                </Button>

                <Button
                  size="lg"
                  variant="destructive"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Notes & AI Insights */}
        <div className="flex flex-col gap-3 sm:gap-4 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardContent className="p-3 sm:p-4 flex flex-col flex-1 min-h-0">
              <Tabs defaultValue="notes" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notes" className="text-xs sm:text-sm">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Notes</span>
                    <span className="xs:hidden">Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs sm:text-sm">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">AI Insights</span>
                    <span className="xs:hidden">AI</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="flex-1 flex flex-col mt-3 sm:mt-4 min-h-0">
                  <Label className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Consultation Notes</Label>
                  <Textarea
                    placeholder="Take notes during your consultation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 resize-none text-xs sm:text-sm min-h-[120px]"
                  />
                  <p className="text-xs text-gray-500 mt-1.5 sm:mt-2">
                    These notes will be included in your consultation summary
                  </p>
                </TabsContent>

                <TabsContent value="ai" className="flex-1 flex flex-col mt-3 sm:mt-4 space-y-2 sm:space-y-3 overflow-y-auto">
                  <div className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-blue-900">AI Assistant Active</p>
                      <p className="text-xs text-blue-700 mt-0.5 sm:mt-1">
                        Listening and providing real-time insights
                      </p>
                    </div>
                  </div>

                  {aiInsights.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center p-4 sm:p-6">
                      <div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-primary border-t-transparent rounded-full mx-auto mb-2 sm:mb-3"
                        />
                        <p className="text-xs sm:text-sm text-gray-600">Analyzing conversation...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 sm:space-y-3">
                      {aiInsights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-xs sm:text-sm text-gray-900">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Consultation Details</h4>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Type:</span>
                  <Badge variant="secondary" className="text-xs">Video Call</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formatDuration(duration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="destructive" className="animate-pulse text-xs">Live</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Label component for accessibility
const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={className}>{children}</label>
);
