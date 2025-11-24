import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, FileHeart, ArrowRight, ArrowLeft, Heart, Pill, Info } from 'lucide-react';

interface ChronicDisease {
  name: string;
  diagnosedYear: number;
  notes: string;
}

interface Surgery {
  name: string;
  year: number;
  notes: string;
}

interface Hospitalization {
  reason: string;
  year: number;
  duration: string;
  hospital: string;
}

interface FamilyHistory {
  relation: string;
  condition: string;
  notes: string;
}

interface MedicalHistoryData {
  chronicDiseases: ChronicDisease[];
  previousSurgeries: Surgery[];
  hospitalizations: Hospitalization[];
  familyMedicalHistory: FamilyHistory[];
}

interface OnboardingStep2Props {
  onNext: (data: MedicalHistoryData) => void;
  onBack: () => void;
  initialData?: MedicalHistoryData;
}

const OnboardingStep2: React.FC<OnboardingStep2Props> = ({ onNext, onBack, initialData }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<MedicalHistoryData>({
    chronicDiseases: initialData?.chronicDiseases || [],
    previousSurgeries: initialData?.previousSurgeries || [],
    hospitalizations: initialData?.hospitalizations || [],
    familyMedicalHistory: initialData?.familyMedicalHistory || []
  });

  // Chronic Diseases
  const addChronicDisease = () => {
    setFormData({
      ...formData,
      chronicDiseases: [...formData.chronicDiseases, { name: '', diagnosedYear: new Date().getFullYear(), notes: '' }]
    });
  };

  const removeChronicDisease = (index: number) => {
    setFormData({
      ...formData,
      chronicDiseases: formData.chronicDiseases.filter((_, i) => i !== index)
    });
  };

  const updateChronicDisease = (index: number, field: keyof ChronicDisease, value: any) => {
    const updated = [...formData.chronicDiseases];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, chronicDiseases: updated });
  };

  // Surgeries
  const addSurgery = () => {
    setFormData({
      ...formData,
      previousSurgeries: [...formData.previousSurgeries, { name: '', year: new Date().getFullYear(), notes: '' }]
    });
  };

  const removeSurgery = (index: number) => {
    setFormData({
      ...formData,
      previousSurgeries: formData.previousSurgeries.filter((_, i) => i !== index)
    });
  };

  const updateSurgery = (index: number, field: keyof Surgery, value: any) => {
    const updated = [...formData.previousSurgeries];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, previousSurgeries: updated });
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
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, 30, 0], y: [0, -50, 0] }}
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <FileHeart className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Medical History</CardTitle>
                <CardDescription className="text-base">
                  Step 2 of 4 • All fields are optional
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-4 bg-blue-50/80 border border-blue-200/50 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Share any relevant medical history that might help your doctor provide better care. You can skip this and add details later.
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Chronic Diseases */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">Chronic Diseases</Label>
                    <span className="text-sm text-gray-400">(Optional)</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addChronicDisease}
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {formData.chronicDiseases.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Pill className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No chronic diseases added</p>
                  </div>
                )}

                {formData.chronicDiseases.map((disease, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 border border-blue-100 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <Label className="text-sm font-medium">Disease {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChronicDisease(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Disease name"
                        value={disease.name}
                        onChange={(e) => updateChronicDisease(index, 'name', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Year diagnosed"
                        value={disease.diagnosedYear || ''}
                        onChange={(e) => updateChronicDisease(index, 'diagnosedYear', parseInt(e.target.value))}
                      />
                    </div>
                    <Textarea
                      placeholder="Additional notes (optional)"
                      value={disease.notes}
                      onChange={(e) => updateChronicDisease(index, 'notes', e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Previous Surgeries */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <Label className="text-lg font-semibold">Previous Surgeries</Label>
                    <span className="text-sm text-gray-400">(Optional)</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSurgery}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>

                {formData.previousSurgeries.length === 0 && (
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No surgeries added</p>
                  </div>
                )}

                {formData.previousSurgeries.map((surgery, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-red-50/50 to-pink-50/50 border border-red-100 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <Label className="text-sm font-medium">Surgery {index + 1}</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSurgery(index)}
                        className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Surgery name"
                        value={surgery.name}
                        onChange={(e) => updateSurgery(index, 'name', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Year"
                        value={surgery.year || ''}
                        onChange={(e) => updateSurgery(index, 'year', parseInt(e.target.value))}
                      />
                    </div>
                    <Textarea
                      placeholder="Additional notes (optional)"
                      value={surgery.notes}
                      onChange={(e) => updateSurgery(index, 'notes', e.target.value)}
                      className="resize-none"
                      rows={2}
                    />
                  </motion.div>
                ))}
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
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Continue to Lifestyle
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

export default OnboardingStep2;
