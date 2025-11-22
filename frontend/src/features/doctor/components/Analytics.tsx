import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const consultationData = [
  { month: 'Jan', consultations: 24, completed: 20, pending: 4 },
  { month: 'Feb', consultations: 32, completed: 28, pending: 4 },
  { month: 'Mar', consultations: 28, completed: 26, pending: 2 },
  { month: 'Apr', consultations: 35, completed: 33, pending: 2 },
  { month: 'May', consultations: 42, completed: 40, pending: 2 },
  { month: 'Jun', consultations: 38, completed: 36, pending: 2 }
];

const patientTypeData = [
  { name: 'New Patients', value: 35, color: '#3b82f6' },
  { name: 'Follow-ups', value: 55, color: '#10b981' },
  { name: 'Referrals', value: 10, color: '#f59e0b' }
];

const consultationTypeData = [
  { type: 'Video', count: 65 },
  { type: 'In-Person', count: 28 },
  { type: 'Phone', count: 7 }
];

const symptomData = [
  { symptom: 'Fever', count: 24 },
  { symptom: 'Headache', count: 18 },
  { symptom: 'Chest Pain', count: 15 },
  { symptom: 'Cough', count: 12 },
  { symptom: 'Fatigue', count: 10 }
];

const stats = [
  {
    title: 'Total Consultations',
    value: '237',
    change: '+12%',
    icon: Users,
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-50'
  },
  {
    title: 'Avg. Duration',
    value: '28 min',
    change: '+2%',
    icon: Clock,
    color: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50'
  },
  {
    title: 'Success Rate',
    value: '94%',
    change: '+5%',
    icon: CheckCircle2,
    color: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50'
  },
  {
    title: 'Pending Cases',
    value: '8',
    change: '-3%',
    icon: AlertCircle,
    color: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50'
  }
];

export const Analytics = () => {
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
            Analytics & Insights
          </h1>
          <p className="text-muted-foreground mt-1">Track your practice performance</p>
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
            <Card className={`p-6 border-0 shadow-lg ${stat.bg}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6 border-0 shadow-lg">
          <Tabs defaultValue="consultations" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="consultations">Consultations</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="patients">Patients</TabsTrigger>
              <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
            </TabsList>

            <TabsContent value="consultations" className="mt-6">
              <h3 className="font-semibold mb-4">Consultation Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="consultations" stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="types" className="mt-6">
              <h3 className="font-semibold mb-4">Consultation Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={consultationTypeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="patients" className="mt-6">
              <h3 className="font-semibold mb-4">Patient Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={patientTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patientTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="symptoms" className="mt-6">
              <h3 className="font-semibold mb-4">Top Symptoms</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={symptomData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="symptom" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-semibold mb-4">Performance Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Consultation Completion Rate</span>
                <span className="font-semibold">94%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-muted-foreground">Patient Satisfaction</span>
                <span className="font-semibold">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-muted-foreground">Average Response Time</span>
                <span className="font-semibold">2.3 min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 border-0 shadow-lg">
            <h3 className="font-semibold mb-4">Revenue Insights</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">This Month</span>
                <span className="font-semibold text-lg">₹45,600</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">Last Month</span>
                <span className="font-semibold text-lg">₹38,900</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium">Average per Consultation</span>
                <span className="font-semibold text-lg">₹450</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium">Projected (This Month)</span>
                <span className="font-semibold text-lg">₹52,800</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
