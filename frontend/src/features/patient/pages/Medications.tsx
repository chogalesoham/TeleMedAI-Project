import { motion } from 'framer-motion';
import { 
  Pill, 
  Clock, 
  Bell, 
  CheckCircle2,
  Plus,
  Calendar,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockMedications } from '../data/mockData';
import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartCard } from '../components/shared/ChartCard';

const adherenceData = [
  { day: 'Mon', rate: 100 },
  { day: 'Tue', rate: 100 },
  { day: 'Wed', rate: 75 },
  { day: 'Thu', rate: 100 },
  { day: 'Fri', rate: 100 },
  { day: 'Sat', rate: 50 },
  { day: 'Sun', rate: 75 },
];

export const Medications = () => {
  const [selectedDay, setSelectedDay] = useState(0); // 0 = today

  const getTodaySchedule = () => {
    const schedule: Array<{ time: string; medications: typeof mockMedications }> = [];
    const timings = new Set<string>();

    mockMedications.forEach(med => {
      med.timings.forEach(time => timings.add(time));
    });

    Array.from(timings).sort().forEach(time => {
      const meds = mockMedications.filter(med => med.timings.includes(time));
      schedule.push({ time, medications: meds });
    });

    return schedule;
  };

  const schedule = getTodaySchedule();
  const totalMeds = mockMedications.length;
  const takenToday = mockMedications.filter(med => 
    med.taken[selectedDay] === true
  ).length;
  const adherenceRate = Math.round((takenToday / totalMeds) * 100);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2 truncate">Medications & Reminders</h1>
          <p className="text-sm sm:text-base text-gray-600">Track your medication schedule and adherence</p>
        </div>
        <Button className="text-sm w-full sm:w-auto">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add Medication
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Pill className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Active Medications</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalMeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Taken Today</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{takenToday}/{totalMeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Adherence Rate</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{adherenceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 truncate">Upcoming</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Today's Schedule</h3>
              <Tabs defaultValue="schedule" className="space-y-3 sm:space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="schedule" className="text-xs sm:text-sm">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">By Time</span>
                    <span className="xs:hidden">Time</span>
                  </TabsTrigger>
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    <Pill className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">All Medications</span>
                    <span className="xs:hidden">All</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-3 sm:space-y-4">
                  {schedule.map((slot, index) => (
                    <motion.div
                      key={slot.time}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900">{slot.time}</p>
                          <p className="text-xs sm:text-sm text-gray-600">{slot.medications.length} medication(s)</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {slot.medications.map((med) => {
                          const isTaken = med.taken[selectedDay];
                          return (
                            <div
                              key={med.id}
                              className={`flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-lg transition-colors ${
                                isTaken ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isTaken ? 'bg-green-600' : 'bg-gray-300'
                                }`}>
                                  {isTaken ? (
                                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                  ) : (
                                    <Pill className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{med.name}</p>
                                  <p className="text-xs sm:text-sm text-gray-600">{med.dosage}</p>
                                </div>
                              </div>
                              {!isTaken && (
                                <Button size="sm" className="text-xs flex-shrink-0">
                                  <span className="hidden sm:inline">Mark as Taken</span>
                                  <span className="sm:hidden">Mark</span>
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="all" className="space-y-2 sm:space-y-3">
                  {mockMedications.map((med, index) => (
                    <motion.div
                      key={med.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
                        <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Pill className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{med.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs flex-shrink-0">{med.duration}</Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="text-xs sm:text-sm">
                          <p className="text-gray-600">Timings:</p>
                          <p className="font-medium truncate">{med.timings.join(', ')}</p>
                        </div>
                        <div className="text-xs sm:text-sm">
                          <p className="text-gray-600">This Week:</p>
                          <div className="flex gap-1 mt-1">
                            {med.taken.map((taken, i) => (
                              <div
                                key={i}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center text-xs ${
                                  taken ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                                }`}
                              >
                                {taken ? '✓' : '–'}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {med.instructions && (
                        <div className="p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs sm:text-sm">
                          <div className="flex items-start gap-1.5 sm:gap-2">
                            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <span className="text-amber-900">{med.instructions}</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Adherence Chart */}
          <ChartCard title="Weekly Adherence" description="Your medication adherence this week">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={adherenceData}>
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Reminders */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <h3 className="text-sm sm:text-base font-semibold text-gray-900">Upcoming Reminders</h3>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="p-2.5 sm:p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Lisinopril</p>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">08:00 AM</Badge>
                  </div>
                  <p className="text-xs text-gray-600">In 2 hours</p>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="font-medium text-xs sm:text-sm truncate">Metformin</p>
                    <Badge variant="secondary" className="text-xs flex-shrink-0">08:00 PM</Badge>
                  </div>
                  <p className="text-xs text-gray-600">In 14 hours</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-3 sm:mt-4 text-xs sm:text-sm" size="sm">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                Manage Reminders
              </Button>
            </CardContent>
          </Card>

          {/* Progress This Month */}
          <Card>
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Progress This Month</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">Overall Adherence</span>
                    <span className="text-xs sm:text-sm font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-1.5 sm:h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">On-Time Doses</span>
                    <span className="text-xs sm:text-sm font-semibold">87%</span>
                  </div>
                  <Progress value={87} className="h-1.5 sm:h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">Missed Doses</span>
                    <span className="text-xs sm:text-sm font-semibold text-red-600">3</span>
                  </div>
                  <Progress value={8} className="h-1.5 sm:h-2 bg-red-100" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2 sm:mb-3">Medication Tips</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>Set alarms for medication times</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>Keep medications in a visible place</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>Use a pill organizer</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                  <span>Track in the app daily</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
