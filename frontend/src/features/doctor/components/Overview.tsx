import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  Activity,
  Brain,
  MessageSquare,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const stats = [
  {
    title: "Today's Patients",
    value: "24",
    change: "+12%",
    icon: Users,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Pending Reports",
    value: "8",
    change: "-3%",
    icon: FileText,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50"
  },
  {
    title: "AI Consultations",
    value: "18",
    change: "+24%",
    icon: Brain,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50"
  },
  {
    title: "Success Rate",
    value: "98%",
    change: "+2%",
    icon: TrendingUp,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50"
  }
];

const upcomingAppointments = [
  {
    id: 1,
    patient: "Priya Sharma",
    time: "9:30 AM",
    type: "Video Consultation",
    severity: "medium",
    aiScore: 72,
    symptoms: "Fever, Headache, Fatigue"
  },
  {
    id: 2,
    patient: "Rajesh Kumar",
    time: "10:15 AM",
    type: "In-Person",
    severity: "low",
    aiScore: 45,
    symptoms: "Routine Checkup"
  },
  {
    id: 3,
    patient: "Anjali Verma",
    time: "11:00 AM",
    type: "Video Consultation",
    severity: "high",
    aiScore: 89,
    symptoms: "Chest Pain, Shortness of Breath"
  }
];

const recentActivities = [
  {
    id: 1,
    type: "consultation",
    patient: "Arjun Singh",
    time: "2 hours ago",
    description: "Completed AI-assisted consultation",
    status: "completed"
  },
  {
    id: 2,
    type: "report",
    patient: "Neha Patel",
    time: "3 hours ago",
    description: "Lab report analyzed by AI",
    status: "completed"
  },
  {
    id: 3,
    type: "prescription",
    patient: "Vikram Desai",
    time: "5 hours ago",
    description: "Prescription generated with AI assistance",
    status: "completed"
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

export const Overview = () => {
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
            Doctor Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your practice with AI-powered insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
            <Brain className="w-4 h-4 mr-2" />
            Start AI Consultation
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn("p-6 border-0 shadow-lg", stat.bgColor)}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                  stat.color
                )}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Today's Appointments</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => {
                const SeverityIcon = getSeverityIcon(appointment.severity);
                
                return (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-muted/50 to-background border border-border/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {appointment.patient}
                        </h3>
                        <Badge className={getSeverityColor(appointment.severity)}>
                          <SeverityIcon className="w-3 h-3 mr-1" />
                          {appointment.severity} severity
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {appointment.type}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Symptoms: {appointment.symptoms}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">AI Score:</span>
                          <Progress value={appointment.aiScore} className="w-20 h-2" />
                          <span className="text-xs font-medium">{appointment.aiScore}%</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                      Start
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">Recent Activities</h2>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.patient}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-6">
              View All Activities
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Overview;
