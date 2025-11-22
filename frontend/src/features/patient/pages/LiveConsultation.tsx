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
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Consultation</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="destructive" className="animate-pulse">
              <div className="w-2 h-2 rounded-full bg-white mr-2" />
              LIVE
            </Badge>
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Activity className="w-4 h-4 mr-1" />
          AI Monitoring Active
        </Badge>
      </div>

      <div className="flex-1 grid lg:grid-cols-3 gap-4 min-h-0">
        {/* Video Section */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Doctor Video (Large) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 relative bg-gray-900 rounded-lg overflow-hidden"
          >
            {/* Placeholder for video stream */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 border-4 border-white/20">
                  <AvatarImage src={doctor.image} />
                  <AvatarFallback>{doctor.name[4]}{doctor.name.split(' ')[1]?.[0]}</AvatarFallback>
                </Avatar>
                <h3 className="text-white text-xl font-semibold">{doctor.name}</h3>
                <p className="text-gray-300">{doctor.specialization}</p>
              </div>
            </div>

            {/* Patient Video (Small - Picture in Picture) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white/20"
            >
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                {isVideoOff ? (
                  <div className="text-center">
                    <VideoOff className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-sm">Camera Off</p>
                  </div>
                ) : (
                  <div className="text-white text-sm">You</div>
                )}
              </div>
            </motion.div>

            {/* Connection Quality Indicator */}
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-green-600 text-white">
                <div className="w-2 h-2 rounded-full bg-white mr-2" />
                Excellent Connection
              </Badge>
            </div>

            {/* Fullscreen Button */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-4 right-4"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Call Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={isMuted ? 'destructive' : 'outline'}
                  className="w-16 h-16 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                
                <Button
                  size="lg"
                  variant={isVideoOff ? 'destructive' : 'outline'}
                  className="w-16 h-16 rounded-full"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>

                <Button
                  size="lg"
                  variant="destructive"
                  className="w-20 h-20 rounded-full"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="w-8 h-8" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Notes & AI Insights */}
        <div className="flex flex-col gap-4 min-h-0">
          <Card className="flex-1 flex flex-col min-h-0">
            <CardContent className="p-4 flex flex-col flex-1 min-h-0">
              <Tabs defaultValue="notes" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notes">
                    <FileText className="w-4 h-4 mr-2" />
                    Notes
                  </TabsTrigger>
                  <TabsTrigger value="ai">
                    <Activity className="w-4 h-4 mr-2" />
                    AI Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="notes" className="flex-1 flex flex-col mt-4 min-h-0">
                  <Label className="text-sm font-medium mb-2">Consultation Notes</Label>
                  <Textarea
                    placeholder="Take notes during your consultation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    These notes will be included in your consultation summary
                  </p>
                </TabsContent>

                <TabsContent value="ai" className="flex-1 flex flex-col mt-4 space-y-3 overflow-y-auto">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Activity className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">AI Assistant Active</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Listening and providing real-time insights
                      </p>
                    </div>
                  </div>

                  {aiInsights.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center p-6">
                      <div>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"
                        />
                        <p className="text-sm text-gray-600">Analyzing conversation...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {aiInsights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-sm text-gray-900">{insight}</p>
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
            <CardContent className="p-4">
              <h4 className="font-semibold text-sm mb-3">Consultation Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge variant="secondary">Video Call</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{formatDuration(duration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <Badge variant="destructive" className="animate-pulse">Live</Badge>
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
