import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface PreferredTime {
  day: string;
  timeSlot: string;
}

interface SpecialistPreference {
  specialty: string;
  priority: number;
}

interface TelemedicinePreferencesData {
  preferredConsultationType: string[];
  preferredConsultationTime: PreferredTime[];
  notificationPreferences: {
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  languagePreference: string;
  specialistPreferences: SpecialistPreference[];
}

interface OnboardingStep4Props {
  onNext: (data: TelemedicinePreferencesData) => void;
  onBack: () => void;
  initialData?: TelemedicinePreferencesData;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ onNext, onBack, initialData }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<TelemedicinePreferencesData>({
    preferredConsultationType: initialData?.preferredConsultationType || ['Video'],
    preferredConsultationTime: initialData?.preferredConsultationTime || [],
    notificationPreferences: initialData?.notificationPreferences || {
      sms: true,
      email: true,
      push: true
    },
    languagePreference: initialData?.languagePreference || 'English',
    specialistPreferences: initialData?.specialistPreferences || []
  });

  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [specialtyInput, setSpecialtyInput] = useState('');

  const consultationTypes = ['Video', 'Audio', 'Chat'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['Morning (6AM-12PM)', 'Afternoon (12PM-6PM)', 'Evening (6PM-12AM)'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Hindi', 'Arabic'];
  const specialties = [
    'Cardiologist',
    'Dermatologist',
    'Endocrinologist',
    'Gastroenterologist',
    'Neurologist',
    'Orthopedic',
    'Pediatrician',
    'Psychiatrist',
    'General Physician'
  ];

  const toggleConsultationType = (type: string) => {
    if (formData.preferredConsultationType.includes(type)) {
      setFormData({
        ...formData,
        preferredConsultationType: formData.preferredConsultationType.filter(t => t !== type)
      });
    } else {
      setFormData({
        ...formData,
        preferredConsultationType: [...formData.preferredConsultationType, type]
      });
    }
  };

  const addPreferredTime = () => {
    if (!selectedDay || !selectedTimeSlot) {
      toast({
        title: 'Selection Required',
        description: 'Please select both day and time slot',
        variant: 'destructive'
      });
      return;
    }

    const exists = formData.preferredConsultationTime.some(
      time => time.day === selectedDay && time.timeSlot === selectedTimeSlot
    );

    if (exists) {
      toast({
        title: 'Already Added',
        description: 'This time slot is already in your preferences',
        variant: 'destructive'
      });
      return;
    }

    setFormData({
      ...formData,
      preferredConsultationTime: [
        ...formData.preferredConsultationTime,
        { day: selectedDay, timeSlot: selectedTimeSlot }
      ]
    });

    setSelectedDay('');
    setSelectedTimeSlot('');
  };

  const removePreferredTime = (index: number) => {
    setFormData({
      ...formData,
      preferredConsultationTime: formData.preferredConsultationTime.filter((_, i) => i !== index)
    });
  };

  const addSpecialist = () => {
    if (!specialtyInput) {
      toast({
        title: 'Selection Required',
        description: 'Please select a specialty',
        variant: 'destructive'
      });
      return;
    }

    const exists = formData.specialistPreferences.some(s => s.specialty === specialtyInput);
    if (exists) {
      toast({
        title: 'Already Added',
        description: 'This specialty is already in your preferences',
        variant: 'destructive'
      });
      return;
    }

    setFormData({
      ...formData,
      specialistPreferences: [
        ...formData.specialistPreferences,
        { specialty: specialtyInput, priority: formData.specialistPreferences.length + 1 }
      ]
    });

    setSpecialtyInput('');
  };

  const removeSpecialist = (index: number) => {
    const updated = formData.specialistPreferences
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, priority: i + 1 }));
    
    setFormData({
      ...formData,
      specialistPreferences: updated
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.preferredConsultationType.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one consultation type',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.notificationPreferences.sms && 
        !formData.notificationPreferences.email && 
        !formData.notificationPreferences.push) {
      toast({
        title: 'Validation Error',
        description: 'Please select at least one notification method',
        variant: 'destructive'
      });
      return;
    }

    onNext(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Telemedicine Preferences</CardTitle>
        <CardDescription>
          Set your preferences for online consultations. This helps us provide you with the best experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Consultation Type */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Preferred Consultation Type</Label>
            <p className="text-sm text-muted-foreground">Select all that apply</p>
            <div className="space-y-3">
              {consultationTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.preferredConsultationType.includes(type)}
                    onCheckedChange={() => toggleConsultationType(type)}
                  />
                  <label
                    htmlFor={type}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {type} Call
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Time */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Preferred Consultation Time</Label>
            <p className="text-sm text-muted-foreground">When are you usually available?</p>
            <div className="flex gap-2">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addPreferredTime}>Add</Button>
            </div>
            
            {formData.preferredConsultationTime.length > 0 && (
              <div className="space-y-2">
                {formData.preferredConsultationTime.map((time, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">
                      {time.day} - {time.timeSlot}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreferredTime(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Notification Preferences</Label>
            <p className="text-sm text-muted-foreground">How would you like to receive updates?</p>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sms"
                  checked={formData.notificationPreferences.sms}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    notificationPreferences: {
                      ...formData.notificationPreferences,
                      sms: checked as boolean
                    }
                  })}
                />
                <label htmlFor="sms" className="text-sm font-medium cursor-pointer">
                  SMS Text Messages
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="email"
                  checked={formData.notificationPreferences.email}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    notificationPreferences: {
                      ...formData.notificationPreferences,
                      email: checked as boolean
                    }
                  })}
                />
                <label htmlFor="email" className="text-sm font-medium cursor-pointer">
                  Email
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="push"
                  checked={formData.notificationPreferences.push}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    notificationPreferences: {
                      ...formData.notificationPreferences,
                      push: checked as boolean
                    }
                  })}
                />
                <label htmlFor="push" className="text-sm font-medium cursor-pointer">
                  Push Notifications
                </label>
              </div>
            </div>
          </div>

          {/* Language Preference */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Language Preference</Label>
            <Select
              value={formData.languagePreference}
              onValueChange={(value) => setFormData({ ...formData, languagePreference: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Specialist Preferences */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Specialist Preferences (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Select specialists you might need. Order matters - your first choice gets priority.
            </p>
            <div className="flex gap-2">
              <Select value={specialtyInput} onValueChange={setSpecialtyInput}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties
                    .filter(s => !formData.specialistPreferences.some(p => p.specialty === s))
                    .map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <Button type="button" onClick={addSpecialist}>Add</Button>
            </div>

            {formData.specialistPreferences.length > 0 && (
              <div className="space-y-2">
                {formData.specialistPreferences.map((pref, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">
                      {index + 1}. {pref.specialty}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecialist(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" size="lg">
              Complete Onboarding
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingStep4;
