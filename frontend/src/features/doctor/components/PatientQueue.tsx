import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Activity,
  Brain,
  Video,
  Phone,
  Calendar,
  FileText,
  TrendingUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const patients = [
  {
    id: 1,
    name: "Priya Sharma",
    age: 34,
    gender: "Female",
    appointmentTime: "9:30 AM",
    waitTime: "5 min",
    severity: "high",
    aiScore: 89,
    symptoms: "Chest pain, shortness of breath, fatigue",
    aiAnalysis: "High probability of cardiac issues - immediate attention required",
    type: "video",
    previousVisits: 3,
    insurance: "Verified",
    reports: ["Blood Test", "ECG"]
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    appointmentTime: "10:15 AM",
    waitTime: "20 min",
    severity: "medium",
    aiScore: 67,
    symptoms: "Fever, headache, body aches",
    aiAnalysis: "Viral infection symptoms - recommend rest and hydration",
    type: "in-person",
    previousVisits: 1,
    insurance: "Pending",
    reports: []
  },
  {
    id: 3,
    name: "Anjali Verma",
    age: 28,
    gender: "Female",
    appointmentTime: "11:00 AM",
    waitTime: "45 min",
    severity: "low",
    aiScore: 34,
    symptoms: "Routine checkup, prescription renewal",
    aiAnalysis: "Standard follow-up - no urgent concerns",
    type: "video",
    previousVisits: 8,
    insurance: "Verified",
    reports: ["X-Ray"]
  },
  {
    id: 4,
    name: "Vikram Desai",
    age: 52,
    gender: "Male",
    appointmentTime: "11:45 AM",
    waitTime: "1 hour",
    severity: "high",
    aiScore: 92,
    symptoms: "Severe abdominal pain, nausea, vomiting",
    aiAnalysis: "Possible appendicitis or gastrointestinal emergency",
    type: "emergency",
    previousVisits: 0,
    insurance: "Verified",
    reports: []
  }
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'bg-red-100 text-red-700 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'high': return AlertCircle;
    case 'medium': return Clock;
    case 'low': return CheckCircle2;
    default: return Activity;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-red-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-green-600';
};

export const PatientQueue = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<typeof patients[0] | null>(null);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || patient.severity === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: patients.length,
    high: patients.filter(p => p.severity === 'high').length,
    medium: patients.filter(p => p.severity === 'medium').length,
    low: patients.filter(p => p.severity === 'low').length
  };

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
            Patient Queue
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered triage and patient management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Users className="w-4 h-4 mr-2" />
            Add Patient
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: stats.total, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
          { label: 'High Priority', value: stats.high, color: 'from-red-500 to-pink-500', bg: 'bg-red-50' },
          { label: 'Medium Priority', value: stats.medium, color: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-50' },
          { label: 'Low Priority', value: stats.low, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("p-4 border-0 shadow-lg", stat.bg)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br", stat.color)}>
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-4 border-0 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Patients ({stats.total})</TabsTrigger>
              <TabsTrigger value="high">High ({stats.high})</TabsTrigger>
              <TabsTrigger value="medium">Medium ({stats.medium})</TabsTrigger>
              <TabsTrigger value="low">Low ({stats.low})</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>
      </motion.div>

      {/* Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-4"
        >
          {filteredPatients.map((patient, index) => {
            const SeverityIcon = getSeverityIcon(patient.severity);
            
            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all duration-200",
                  selectedPatient?.id === patient.id
                    ? "bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 shadow-lg"
                    : "bg-gradient-to-r from-muted/50 to-background border-border/40 hover:shadow-md"
                )}
                onClick={() => setSelectedPatient(patient)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{patient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {patient.age} years • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <Badge className={getSeverityColor(patient.severity)}>
                    <SeverityIcon className="w-3 h-3 mr-1" />
                    {patient.severity}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.appointmentTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <span>Wait: {patient.waitTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {patient.type === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    <span className="capitalize">{patient.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{patient.previousVisits} visits</span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-foreground mb-1">Symptoms:</p>
                  <p className="text-sm text-muted-foreground">{patient.symptoms}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">AI Score:</span>
                    <Progress value={patient.aiScore} className="w-16 h-2" />
                    <span className={cn("text-sm font-medium", getScoreColor(patient.aiScore))}>
                      {patient.aiScore}%
                    </span>
                  </div>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                    Start Consultation
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Patient Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          {selectedPatient ? (
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.age} years • {selectedPatient.gender}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">AI Analysis</h4>
                  <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <p className="text-sm text-foreground">{selectedPatient.aiAnalysis}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Quick Stats</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AI Risk Score</span>
                      <span className={cn("font-medium", getScoreColor(selectedPatient.aiScore))}>
                        {selectedPatient.aiScore}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Previous Visits</span>
                      <span className="font-medium">{selectedPatient.previousVisits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Insurance</span>
                      <span className="font-medium">{selectedPatient.insurance}</span>
                    </div>
                  </div>
                </div>

                {selectedPatient.reports.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Available Reports</h4>
                    <div className="space-y-2">
                      {selectedPatient.reports.map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                          <span className="text-sm">{report}</span>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1 bg-gradient-to-r from-primary to-accent">
                    Start Consultation
                  </Button>
                  <Button variant="outline">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 border-0 shadow-lg text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a patient to view details</p>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PatientQueue;
