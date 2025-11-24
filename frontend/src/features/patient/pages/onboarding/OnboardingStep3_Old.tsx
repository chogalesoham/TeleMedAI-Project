import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  prescribedBy: string;
}

interface Allergy {
  allergen: string;
  reaction: string;
  severity: string;
}

interface OngoingTreatment {
  condition: string;
  treatmentType: string;
  provider: string;
  startDate: string;
}

interface CurrentHealthStatusData {
  currentMedications: Medication[];
  allergies: Allergy[];
  smokingStatus: string;
  smokingDetails: {
    cigarettesPerDay: number;
    yearsSmoked: number;
  };
  alcoholConsumption: string;
  alcoholDetails: {
    drinksPerWeek: number;
  };
  exerciseFrequency: string;
  exerciseType: string[];
  sleepHours: {
    average: number;
    quality: string;
  };
  ongoingTreatments: OngoingTreatment[];
}

interface OnboardingStep3Props {
  onNext: (data: CurrentHealthStatusData) => void;
  onBack: () => void;
  initialData?: CurrentHealthStatusData;
}

const OnboardingStep3: React.FC<OnboardingStep3Props> = ({ onNext, onBack, initialData }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CurrentHealthStatusData>({
    currentMedications: initialData?.currentMedications || [],
    allergies: initialData?.allergies || [],
    smokingStatus: initialData?.smokingStatus || 'Never',
    smokingDetails: initialData?.smokingDetails || { cigarettesPerDay: 0, yearsSmoked: 0 },
    alcoholConsumption: initialData?.alcoholConsumption || 'Never',
    alcoholDetails: initialData?.alcoholDetails || { drinksPerWeek: 0 },
    exerciseFrequency: initialData?.exerciseFrequency || '',
    exerciseType: initialData?.exerciseType || [],
    sleepHours: initialData?.sleepHours || { average: 7, quality: 'Good' },
    ongoingTreatments: initialData?.ongoingTreatments || []
  });

  // Medications
  const addMedication = () => {
    setFormData({
      ...formData,
      currentMedications: [...formData.currentMedications, { name: '', dosage: '', frequency: '', startDate: '', prescribedBy: '' }]
    });
  };

  const removeMedication = (index: number) => {
    setFormData({
      ...formData,
      currentMedications: formData.currentMedications.filter((_, i) => i !== index)
    });
  };

  const updateMedication = (index: number, field: keyof Medication, value: any) => {
    const updated = [...formData.currentMedications];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, currentMedications: updated });
  };

  // Allergies
  const addAllergy = () => {
    setFormData({
      ...formData,
      allergies: [...formData.allergies, { allergen: '', reaction: '', severity: 'Mild' }]
    });
  };

  const removeAllergy = (index: number) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((_, i) => i !== index)
    });
  };

  const updateAllergy = (index: number, field: keyof Allergy, value: any) => {
    const updated = [...formData.allergies];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, allergies: updated });
  };

  // Ongoing Treatments
  const addTreatment = () => {
    setFormData({
      ...formData,
      ongoingTreatments: [...formData.ongoingTreatments, { condition: '', treatmentType: '', provider: '', startDate: '' }]
    });
  };

  const removeTreatment = (index: number) => {
    setFormData({
      ...formData,
      ongoingTreatments: formData.ongoingTreatments.filter((_, i) => i !== index)
    });
  };

  const updateTreatment = (index: number, field: keyof OngoingTreatment, value: any) => {
    const updated = [...formData.ongoingTreatments];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, ongoingTreatments: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.exerciseFrequency) {
      toast({
        title: 'Validation Error',
        description: 'Please select your exercise frequency',
        variant: 'destructive'
      });
      return;
    }

    onNext(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Current Health Status</CardTitle>
        <CardDescription>
          Tell us about your current health habits and medications. This information is confidential and helps us provide better care.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Current Medications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Current Medications</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>
            {formData.currentMedications.map((med, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeMedication(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Input
                  placeholder="Medication name"
                  value={med.name}
                  onChange={(e) => updateMedication(index, 'name', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Dosage (e.g., 500mg)"
                    value={med.dosage}
                    onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                  />
                  <Input
                    placeholder="Frequency (e.g., twice daily)"
                    value={med.frequency}
                    onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="date"
                    placeholder="Start date"
                    value={med.startDate}
                    onChange={(e) => updateMedication(index, 'startDate', e.target.value)}
                  />
                  <Input
                    placeholder="Prescribed by"
                    value={med.prescribedBy}
                    onChange={(e) => updateMedication(index, 'prescribedBy', e.target.value)}
                  />
                </div>
              </div>
            ))}
            {formData.currentMedications.length === 0 && (
              <p className="text-sm text-muted-foreground">No medications added</p>
            )}
          </div>

          {/* Allergies */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-red-600">Allergies (Critical Information)</Label>
              <Button type="button" variant="outline" size="sm" onClick={addAllergy}>
                <Plus className="w-4 h-4 mr-2" />
                Add Allergy
              </Button>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please list all known allergies. This is critical for your safety during treatment.
              </AlertDescription>
            </Alert>
            {formData.allergies.map((allergy, index) => (
              <div key={index} className="p-4 border-2 border-red-200 rounded-lg space-y-3 relative bg-red-50">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeAllergy(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Input
                  placeholder="Allergen (e.g., Penicillin)"
                  value={allergy.allergen}
                  onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                  className="bg-white"
                />
                <Input
                  placeholder="Reaction (e.g., rash, breathing difficulty)"
                  value={allergy.reaction}
                  onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                  className="bg-white"
                />
                <Select
                  value={allergy.severity}
                  onValueChange={(value) => updateAllergy(index, 'severity', value)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                    <SelectItem value="Life-threatening">Life-threatening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            {formData.allergies.length === 0 && (
              <p className="text-sm text-muted-foreground">No allergies added</p>
            )}
          </div>

          {/* Smoking Status */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Smoking Habits</Label>
            <Select
              value={formData.smokingStatus}
              onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Never">Never smoked</SelectItem>
                <SelectItem value="Former">Former smoker</SelectItem>
                <SelectItem value="Current">Current smoker</SelectItem>
              </SelectContent>
            </Select>
            {(formData.smokingStatus === 'Current' || formData.smokingStatus === 'Former') && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Cigarettes per day</Label>
                  <Input
                    type="number"
                    value={formData.smokingDetails.cigarettesPerDay}
                    onChange={(e) => setFormData({
                      ...formData,
                      smokingDetails: { ...formData.smokingDetails, cigarettesPerDay: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Years smoked</Label>
                  <Input
                    type="number"
                    value={formData.smokingDetails.yearsSmoked}
                    onChange={(e) => setFormData({
                      ...formData,
                      smokingDetails: { ...formData.smokingDetails, yearsSmoked: parseInt(e.target.value) || 0 }
                    })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Alcohol Consumption */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Alcohol Consumption</Label>
            <Select
              value={formData.alcoholConsumption}
              onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Never">Never</SelectItem>
                <SelectItem value="Occasionally">Occasionally</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Heavy">Heavy</SelectItem>
              </SelectContent>
            </Select>
            {formData.alcoholConsumption !== 'Never' && (
              <div className="space-y-2">
                <Label>Drinks per week</Label>
                <Input
                  type="number"
                  value={formData.alcoholDetails.drinksPerWeek}
                  onChange={(e) => setFormData({
                    ...formData,
                    alcoholDetails: { drinksPerWeek: parseInt(e.target.value) || 0 }
                  })}
                />
              </div>
            )}
          </div>

          {/* Exercise */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Exercise Habits</Label>
            <div className="space-y-2">
              <Label>Exercise Frequency</Label>
              <Select
                value={formData.exerciseFrequency}
                onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Never">Never</SelectItem>
                  <SelectItem value="Rarely">Rarely</SelectItem>
                  <SelectItem value="1-2 times/week">1-2 times per week</SelectItem>
                  <SelectItem value="3-4 times/week">3-4 times per week</SelectItem>
                  <SelectItem value="5+ times/week">5 or more times per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.exerciseFrequency !== 'Never' && (
              <div className="space-y-2">
                <Label>Type of exercise (comma-separated)</Label>
                <Input
                  placeholder="e.g., Walking, Yoga, Swimming"
                  value={formData.exerciseType.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    exerciseType: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })}
                />
              </div>
            )}
          </div>

          {/* Sleep */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Sleep Habits</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Average hours per night</Label>
                <Input
                  type="number"
                  value={formData.sleepHours.average}
                  onChange={(e) => setFormData({
                    ...formData,
                    sleepHours: { ...formData.sleepHours, average: parseFloat(e.target.value) || 0 }
                  })}
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label>Sleep Quality</Label>
                <Select
                  value={formData.sleepHours.quality}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    sleepHours: { ...formData.sleepHours, quality: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Poor">Poor</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ongoing Treatments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Ongoing Treatments</Label>
              <Button type="button" variant="outline" size="sm" onClick={addTreatment}>
                <Plus className="w-4 h-4 mr-2" />
                Add Treatment
              </Button>
            </div>
            {formData.ongoingTreatments.map((treatment, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeTreatment(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Input
                  placeholder="Condition being treated"
                  value={treatment.condition}
                  onChange={(e) => updateTreatment(index, 'condition', e.target.value)}
                />
                <Input
                  placeholder="Type of treatment"
                  value={treatment.treatmentType}
                  onChange={(e) => updateTreatment(index, 'treatmentType', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Healthcare provider"
                    value={treatment.provider}
                    onChange={(e) => updateTreatment(index, 'provider', e.target.value)}
                  />
                  <Input
                    type="date"
                    value={treatment.startDate}
                    onChange={(e) => updateTreatment(index, 'startDate', e.target.value)}
                  />
                </div>
              </div>
            ))}
            {formData.ongoingTreatments.length === 0 && (
              <p className="text-sm text-muted-foreground">No ongoing treatments added</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" size="lg">
              Continue to Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingStep3;
