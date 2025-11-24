import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pill, AlertCircle, Dumbbell, Moon, Wine, Cigarette, ArrowRight, ArrowLeft, Info, Activity } from 'lucide-react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}

interface Allergy {
  allergen: string;
  reaction: string;
  severity: string;
}

interface CurrentHealthStatusData {
  currentMedications: Medication[];
  allergies: Allergy[];
  smokingStatus: string;
  alcoholConsumption: string;
  exerciseFrequency: string;
  dietType: string;
  sleepHours: number;
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
    smokingStatus: initialData?.smokingStatus || '',
    alcoholConsumption: initialData?.alcoholConsumption || '',
    exerciseFrequency: initialData?.exerciseFrequency || '',
    dietType: initialData?.dietType || '',
    sleepHours: initialData?.sleepHours || 7
  });

  // Medications
  const addMedication = () => {
    setFormData({
      ...formData,
      currentMedications: [...formData.currentMedications, { name: '', dosage: '', frequency: '' }]
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
      allergies: [...formData.allergies, { allergen: '', reaction: '', severity: '' }]
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // All fields are optional - just save whatever they provide
    onNext(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <motion.div
          className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/15 to-blue-400/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-4xl mx-auto bg-white/90 backdrop-blur-xl shadow-2xl border-gray-200/50">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Lifestyle & Health</CardTitle>
                <CardDescription className="text-base">
                  Step 3 of 4 • All fields are optional
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-4 bg-green-50/80 border border-green-200/50 rounded-xl">
              <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-900">
                Help us understand your lifestyle and current health status. This information helps your doctor provide personalized care.
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Current Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold">Current Medications</Label>
                    <span className="text-sm text-gray-400">(Optional)</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedication}
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {formData.currentMedications.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Pill className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No medications added</p>
                  </div>
                )}

                {formData.currentMedications.map((medication, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <Label className="text-sm font-medium">Medication {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Medication name"
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      />
                      <Input
                        placeholder="Dosage (e.g., 10mg)"
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      />
                      <Input
                        placeholder="Frequency (e.g., Twice daily)"
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Allergies */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <Label className="text-lg font-semibold">Allergies</Label>
                    <span className="text-sm text-gray-400">(Optional)</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAllergy}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {formData.allergies.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No allergies added</p>
                  </div>
                )}

                {formData.allergies.map((allergy, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 border border-orange-100 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <Label className="text-sm font-medium">Allergy {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAllergy(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <Input
                        placeholder="Allergen"
                        value={allergy.allergen}
                        onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                      />
                      <Input
                        placeholder="Reaction"
                        value={allergy.reaction}
                        onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                      />
                      <Select
                        value={allergy.severity}
                        onValueChange={(value) => updateAllergy(index, 'severity', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mild">Mild</SelectItem>
                          <SelectItem value="Moderate">Moderate</SelectItem>
                          <SelectItem value="Severe">Severe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Lifestyle Habits */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-blue-600" />
                  <Label className="text-lg font-semibold">Lifestyle Habits</Label>
                  <span className="text-sm text-gray-400">(All optional)</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Smoking Status */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Cigarette className="w-4 h-4 text-gray-600" />
                      Smoking Status
                    </Label>
                    <Select
                      value={formData.smokingStatus}
                      onValueChange={(value) => setFormData({ ...formData, smokingStatus: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Former">Former Smoker</SelectItem>
                        <SelectItem value="Current">Current Smoker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alcohol Consumption */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Wine className="w-4 h-4 text-purple-600" />
                      Alcohol Consumption
                    </Label>
                    <Select
                      value={formData.alcoholConsumption}
                      onValueChange={(value) => setFormData({ ...formData, alcoholConsumption: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Occasionally">Occasionally</SelectItem>
                        <SelectItem value="Moderate">Moderate (1-7 drinks/week)</SelectItem>
                        <SelectItem value="Heavy">Heavy (8+ drinks/week)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Exercise Frequency */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-green-600" />
                      Exercise Frequency
                    </Label>
                    <Select
                      value={formData.exerciseFrequency}
                      onValueChange={(value) => setFormData({ ...formData, exerciseFrequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="1-2 times/week">1-2 times per week</SelectItem>
                        <SelectItem value="3-4 times/week">3-4 times per week</SelectItem>
                        <SelectItem value="5+ times/week">5+ times per week</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Diet Type */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-orange-600" />
                      Diet Type
                    </Label>
                    <Select
                      value={formData.dietType}
                      onValueChange={(value) => setFormData({ ...formData, dietType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Regular">Regular</SelectItem>
                        <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="Vegan">Vegan</SelectItem>
                        <SelectItem value="Pescatarian">Pescatarian</SelectItem>
                        <SelectItem value="Keto">Keto</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sleep Hours */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-600" />
                      Average Sleep Hours per Night
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      placeholder="7"
                      value={formData.sleepHours || ''}
                      onChange={(e) => setFormData({ ...formData, sleepHours: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onBack}
                  className="border-gray-300"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Continue to Emergency Contact
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingStep3;
