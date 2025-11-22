import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  MessageSquare, 
  FileText, 
  Activity,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Download,
  Share,
  Bot
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const consultationData = {
  patient: {
    name: "Priya Sharma",
    age: 34,
    symptoms: "Chest pain, shortness of breath, fatigue",
    aiScore: 89,
    severity: "high"
  },
  duration: "12:45",
  aiInsights: [
    "Patient mentions chest pain radiating to left arm",
    "Symptoms started 2 hours ago",
    "Patient has history of hypertension",
    "High probability of cardiac event - recommend ECG"
  ],
  keyPoints: [
    "Chest pain: 8/10 severity",
    "Shortness of breath: moderate",
    "No previous cardiac issues",
    "Family history of heart disease"
  ],
  suggestions: [
    "Immediate ECG recommended",
    "Consider cardiac enzymes test",
    "Monitor vital signs closely",
    "Prepare for emergency referral"
  ]
};

export const ConsultationAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [activeTab, setActiveTab] = useState('transcript');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            AI Consultation Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time AI-powered consultation support
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            High Priority
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {consultationData.duration}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Consultation Area */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-0 shadow-lg">
            {/* Video Placeholder */}
            <div className="relative bg-gradient-to-br from-muted/50 to-background rounded-xl overflow-hidden mb-4" style={{ height: '400px' }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4">
                    {consultationData.patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-lg">{consultationData.patient.name}</h3>
                  <p className="text-sm text-muted-foreground">Patient</p>
                </div>
              </div>
              
              {/* Recording Indicator */}
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Recording
                </motion.div>
              )}

              {/* AI Analysis Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-lg p-3 border border-primary/20"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">AI Analysis</span>
                  <Badge className="bg-red-100 text-red-700 text-xs">
                    {consultationData.patient.aiScore}% Risk
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {consultationData.aiInsights[0]}
                </p>
              </motion.div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant={isAudioOn ? "default" : "destructive"}
                size="lg"
                onClick={() => setIsAudioOn(!isAudioOn)}
                className="rounded-full w-12 h-12"
              >
                {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
              <Button
                variant={isVideoOn ? "default" : "destructive"}
                size="lg"
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="rounded-full w-12 h-12"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              <Button
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                onClick={() => setIsRecording(!isRecording)}
                className="rounded-full w-12 h-12"
              >
                <Bot className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="rounded-full w-12 h-12">
                <Phone className="w-5 h-5" />
              </Button>
            </div>
          </Card>

          {/* AI Assistant Panel */}
          <Card className="p-6 border-0 shadow-lg mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transcript">Live Transcript</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="transcript" className="mt-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">P</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">"I've been experiencing chest pain for about 2 hours now..."</p>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-green-600">D</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">"Can you describe the pain? Is it sharp or dull?"</p>
                      <span className="text-xs text-muted-foreground">1 min ago</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-blue-600">P</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">"It's sharp, like someone is squeezing my chest..."</p>
                      <span className="text-xs text-muted-foreground">Just now</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-4">
                <div className="space-y-3">
                  {consultationData.aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
                    >
                      <Brain className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="mt-4">
                <div className="space-y-3">
                  {consultationData.suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{suggestion}</p>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Patient Info */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-semibold text-lg mb-4">Patient Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{consultationData.patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{consultationData.patient.age} years</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Primary Symptoms</p>
                <p className="font-medium text-sm">{consultationData.patient.symptoms}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Risk Assessment</p>
                <div className="flex items-center gap-2 mt-1">
                  <Progress value={consultationData.patient.aiScore} className="flex-1" />
                  <span className="text-sm font-medium text-red-600">
                    {consultationData.patient.aiScore}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Key Points */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-semibold text-lg mb-4">Key Points</h3>
            <div className="space-y-2">
              {consultationData.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full bg-gradient-to-r from-primary to-accent">
                <FileText className="w-4 h-4 mr-2" />
                Generate Summary
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Prescription
              </Button>
              <Button variant="outline" className="w-full">
                <Share className="w-4 h-4 mr-2" />
                Refer Specialist
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ConsultationAssistant;
