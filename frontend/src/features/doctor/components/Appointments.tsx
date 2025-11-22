import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, Video, Plus, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const appointments = [
  {
    id: 1,
    patient: "Priya Sharma",
    date: "2025-11-23",
    time: "9:30 AM",
    type: "video",
    status: "confirmed",
    reason: "Fever, Headache",
    duration: "30 min"
  },
  {
    id: 2,
    patient: "Rajesh Kumar",
    date: "2025-11-23",
    time: "10:15 AM",
    type: "in-person",
    status: "confirmed",
    reason: "Routine Checkup",
    duration: "45 min"
  },
  {
    id: 3,
    patient: "Anjali Verma",
    date: "2025-11-23",
    time: "11:00 AM",
    type: "video",
    status: "pending",
    reason: "Chest Pain",
    duration: "30 min"
  },
  {
    id: 4,
    patient: "Vikram Desai",
    date: "2025-11-24",
    time: "2:00 PM",
    type: "in-person",
    status: "confirmed",
    reason: "Follow-up",
    duration: "20 min"
  },
  {
    id: 5,
    patient: "Neha Patel",
    date: "2025-11-24",
    time: "3:30 PM",
    type: "video",
    status: "confirmed",
    reason: "Prescription Renewal",
    duration: "15 min"
  }
];

export const Appointments = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 23));
  const [selectedAppointment, setSelectedAppointment] = useState<typeof appointments[0] | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `2025-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
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
            Appointments
          </h1>
          <p className="text-muted-foreground mt-1">Manage your consultation schedule</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">{monthName}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {Array(firstDay).fill(null).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map(day => {
                const dayAppointments = getAppointmentsForDate(day);
                return (
                  <button
                    key={day}
                    className={cn(
                      "p-2 rounded-lg text-sm font-medium transition-all",
                      dayAppointments.length > 0
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <div>{day}</div>
                    {dayAppointments.length > 0 && (
                      <div className="text-xs mt-1">{dayAppointments.length} apt</div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-4"
        >
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="font-semibold mb-4">Upcoming Appointments</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {appointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => setSelectedAppointment(apt)}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all",
                    selectedAppointment?.id === apt.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-muted/50 border-border/40 hover:border-border"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{apt.patient}</h3>
                      <p className="text-sm text-muted-foreground">{apt.reason}</p>
                    </div>
                    <Badge className={apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(apt.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {apt.time}
                    </div>
                    <div className="flex items-center gap-1">
                      {apt.type === 'video' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                      {apt.type === 'video' ? 'Video' : 'In-Person'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Appointment Details */}
      {selectedAppointment && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 border-0 shadow-lg">
            <h2 className="font-semibold mb-4">Appointment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Patient Name</p>
                <p className="font-semibold text-lg">{selectedAppointment.patient}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reason for Visit</p>
                <p className="font-semibold">{selectedAppointment.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-semibold">{new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">{selectedAppointment.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consultation Type</p>
                <p className="font-semibold capitalize">{selectedAppointment.type === 'video' ? 'Video Call' : 'In-Person'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={selectedAppointment.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {selectedAppointment.status}
                </Badge>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="bg-gradient-to-r from-primary to-accent">
                {selectedAppointment.type === 'video' ? <Video className="w-4 h-4 mr-2" /> : <Phone className="w-4 h-4 mr-2" />}
                Start Consultation
              </Button>
              <Button variant="outline">Reschedule</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Appointments;
