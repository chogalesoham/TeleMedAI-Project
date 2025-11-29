import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  FileText,
  DollarSign,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import PaymentModal, { PaymentData } from '@/components/appointments/PaymentModal';
import AppointmentService from '@/services/appointment.service';
import { ReportSelector } from '@/components/shared/ReportSelector';
import { toast } from 'sonner';

interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM

  for (let hour = startHour; hour < endHour; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({ startTime, endTime, isAvailable: true });
  }

  return slots;
};

export const AppointmentBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const doctor = location.state?.doctor;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [consultationMode, setConsultationMode] = useState<'tele' | 'in_person'>('tele');
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (!doctor) {
      toast.error('Doctor information not found');
      navigate('/patient-dashboard/doctor-selection');
    }
  }, [doctor, navigate]);

  if (!doctor) {
    return null;
  }

  const doctorFee = doctor.consultationFee?.amount || 500;
  const platformFee = Math.round(doctorFee * 0.10); // 10% platform fee
  const totalAmount = doctorFee + platformFee;

  const handleProceedToPayment = () => {
    // Validation
    if (!selectedDate) {
      toast.error('Please select an appointment date');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    if (!reasonForVisit.trim()) {
      toast.error('Please provide a reason for visit');
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (paymentData: PaymentData) => {
    setIsSubmitting(true);

    try {
      const appointmentData = {
        doctorId: doctor.id,
        appointmentDate: selectedDate!,
        timeSlot: {
          startTime: selectedTimeSlot!.startTime,
          endTime: selectedTimeSlot!.endTime,
        },
        consultationMode,
        reasonForVisit,
        symptoms,
        preDiagnosisReportId: selectedReportId,
        payment: paymentData,
      };

      const response = await AppointmentService.createAppointment(appointmentData);

      if (response.success) {
        toast.success('Appointment booked successfully!');
        navigate('/patient-dashboard/my-appointments');
      } else {
        toast.error(response.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('An error occurred while booking the appointment');
    } finally {
      setIsSubmitting(false);
      setIsPaymentModalOpen(false);
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 0; // Disable Sundays
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8 sm:h-10 sm:w-10"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
            Book Appointment
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Schedule your consultation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Doctor Info Card */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                  <AvatarImage src={doctor.profilePicture} />
                  <AvatarFallback className="text-xl">
                    {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Dr. {doctor.name}
                  </h2>
                  <p className="text-sm text-primary font-medium">
                    {doctor.specialties?.[0] || 'General Practice'}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {doctor.consultationModes?.includes('tele') && (
                      <Badge variant="secondary" className="text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                    {doctor.consultationModes?.includes('in_person') && (
                      <Badge variant="secondary" className="text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        In-Person
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) =>
                  date < new Date() || !isWeekday(date)
                }
                className="rounded-md border"
              />
              <p className="text-xs text-gray-500 mt-2">
                * Sundays are not available for appointments
              </p>
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Select Time Slot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedTimeSlot?.startTime === slot.startTime
                            ? 'default'
                            : 'outline'
                        }
                        className="w-full"
                        onClick={() => setSelectedTimeSlot(slot)}
                        disabled={!slot.isAvailable}
                      >
                        {slot.startTime}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Consultation Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={consultationMode}
                onValueChange={(value) => setConsultationMode(value as 'tele' | 'in_person')}
              >
                <div className="space-y-3">
                  {doctor.consultationModes?.includes('tele') && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors">
                      <RadioGroupItem value="tele" id="tele" />
                      <Label htmlFor="tele" className="flex items-center gap-2 cursor-pointer flex-1">
                        <Video className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Video Consultation</p>
                          <p className="text-xs text-gray-500">
                            Consult from anywhere via video call
                          </p>
                        </div>
                      </Label>
                    </div>
                  )}
                  {doctor.consultationModes?.includes('in_person') && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-gray-200 hover:border-primary transition-colors">
                      <RadioGroupItem value="in_person" id="in_person" />
                      <Label htmlFor="in_person" className="flex items-center gap-2 cursor-pointer flex-1">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">In-Person Visit</p>
                          <p className="text-xs text-gray-500">
                            Visit the clinic in person
                          </p>
                        </div>
                      </Label>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Reason for Visit */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please describe your main concern..."
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div className="pt-2 border-t">
                <ReportSelector
                  selectedReportId={selectedReportId}
                  onSelect={setSelectedReportId}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date & Time */}
              {selectedDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  {selectedTimeSlot && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">
                        {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Fee Breakdown */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-medium">
                    {doctor.consultationFee?.currency || 'INR'} {doctorFee}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (10%)</span>
                  <span className="font-medium">
                    {doctor.consultationFee?.currency || 'INR'} {platformFee}
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-primary">
                    {doctor.consultationFee?.currency || 'INR'} {totalAmount}
                  </span>
                </div>
              </div>

              {/* Proceed Button */}
              <Button
                onClick={handleProceedToPayment}
                size="lg"
                className="w-full"
                disabled={!selectedDate || !selectedTimeSlot || !reasonForVisit.trim()}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Proceed to Payment
              </Button>

              {/* Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Free cancellation up to 24 hours before appointment
                </p>
                <p className="flex items-start gap-1">
                  <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  Secure payment processing
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        doctorFee={doctorFee}
        platformFee={platformFee}
        totalAmount={totalAmount}
        currency={doctor.consultationFee?.currency || 'INR'}
        doctorName={doctor.name}
      />
    </div >
  );
};

export default AppointmentBooking;
