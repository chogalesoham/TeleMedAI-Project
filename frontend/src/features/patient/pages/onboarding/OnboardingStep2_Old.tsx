import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

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

  // Hospitalizations
  const addHospitalization = () => {
    setFormData({
      ...formData,
      hospitalizations: [...formData.hospitalizations, { reason: '', year: new Date().getFullYear(), duration: '', hospital: '' }]
    });
  };

  const removeHospitalization = (index: number) => {
    setFormData({
      ...formData,
      hospitalizations: formData.hospitalizations.filter((_, i) => i !== index)
    });
  };

  const updateHospitalization = (index: number, field: keyof Hospitalization, value: any) => {
    const updated = [...formData.hospitalizations];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, hospitalizations: updated });
  };

  // Family History
  const addFamilyHistory = () => {
    setFormData({
      ...formData,
      familyMedicalHistory: [...formData.familyMedicalHistory, { relation: '', condition: '', notes: '' }]
    });
  };

  const removeFamilyHistory = (index: number) => {
    setFormData({
      ...formData,
      familyMedicalHistory: formData.familyMedicalHistory.filter((_, i) => i !== index)
    });
  };

  const updateFamilyHistory = (index: number, field: keyof FamilyHistory, value: any) => {
    const updated = [...formData.familyMedicalHistory];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, familyMedicalHistory: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Medical History</CardTitle>
        <CardDescription>
          Share your medical history to help us provide better care. You can skip any section if not applicable.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Chronic Diseases */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Chronic Diseases</Label>
              <Button type="button" variant="outline" size="sm" onClick={addChronicDisease}>
                <Plus className="w-4 h-4 mr-2" />
                Add Disease
              </Button>
            </div>
            {formData.chronicDiseases.map((disease, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeChronicDisease(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Input
                  placeholder="Disease name"
                  value={disease.name}
                  onChange={(e) => updateChronicDisease(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Year diagnosed"
                  value={disease.diagnosedYear}
                  onChange={(e) => updateChronicDisease(index, 'diagnosedYear', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear()}
                />
                <Textarea
                  placeholder="Additional notes"
                  value={disease.notes}
                  onChange={(e) => updateChronicDisease(index, 'notes', e.target.value)}
                />
              </div>
            ))}
            {formData.chronicDiseases.length === 0 && (
              <p className="text-sm text-muted-foreground">No chronic diseases added</p>
            )}
          </div>

          {/* Previous Surgeries */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Previous Surgeries</Label>
              <Button type="button" variant="outline" size="sm" onClick={addSurgery}>
                <Plus className="w-4 h-4 mr-2" />
                Add Surgery
              </Button>
            </div>
            {formData.previousSurgeries.map((surgery, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeSurgery(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Input
                  placeholder="Surgery name"
                  value={surgery.name}
                  onChange={(e) => updateSurgery(index, 'name', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Year"
                  value={surgery.year}
                  onChange={(e) => updateSurgery(index, 'year', parseInt(e.target.value))}
                  min="1900"
                  max={new Date().getFullYear()}
                />
                <Textarea
                  placeholder="Additional notes"
                  value={surgery.notes}
                  onChange={(e) => updateSurgery(index, 'notes', e.target.value)}
                />
              </div>
            ))}
            {formData.previousSurgeries.length === 0 && (
              <p className="text-sm text-muted-foreground">No surgeries added</p>
            )}
          </div>

          {/* Hospitalizations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Hospitalizations</Label>
              <Button type="button" variant="outline" size="sm" onClick={addHospitalization}>
                <Plus className="w-4 h-4 mr-2" />
                Add Hospitalization
              </Button>
            </div>
            {formData.hospitalizations.map((hosp, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeHospitalization(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <Input
                  placeholder="Reason for hospitalization"
                  value={hosp.reason}
                  onChange={(e) => updateHospitalization(index, 'reason', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder="Year"
                    value={hosp.year}
                    onChange={(e) => updateHospitalization(index, 'year', parseInt(e.target.value))}
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  <Input
                    placeholder="Duration (e.g., 3 days)"
                    value={hosp.duration}
                    onChange={(e) => updateHospitalization(index, 'duration', e.target.value)}
                  />
                </div>
                <Input
                  placeholder="Hospital name"
                  value={hosp.hospital}
                  onChange={(e) => updateHospitalization(index, 'hospital', e.target.value)}
                />
              </div>
            ))}
            {formData.hospitalizations.length === 0 && (
              <p className="text-sm text-muted-foreground">No hospitalizations added</p>
            )}
          </div>

          {/* Family Medical History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Family Medical History</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFamilyHistory}>
                <Plus className="w-4 h-4 mr-2" />
                Add Family History
              </Button>
            </div>
            {formData.familyMedicalHistory.map((family, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => removeFamilyHistory(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Relation (e.g., Mother)"
                    value={family.relation}
                    onChange={(e) => updateFamilyHistory(index, 'relation', e.target.value)}
                  />
                  <Input
                    placeholder="Condition"
                    value={family.condition}
                    onChange={(e) => updateFamilyHistory(index, 'condition', e.target.value)}
                  />
                </div>
                <Textarea
                  placeholder="Additional notes"
                  value={family.notes}
                  onChange={(e) => updateFamilyHistory(index, 'notes', e.target.value)}
                />
              </div>
            ))}
            {formData.familyMedicalHistory.length === 0 && (
              <p className="text-sm text-muted-foreground">No family history added</p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" size="lg">
              Continue to Current Health Status
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OnboardingStep2;
