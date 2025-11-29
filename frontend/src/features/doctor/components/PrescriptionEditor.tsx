import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface Medicine {
    name: string;
    dosage: string;
    frequency: {
        morning: boolean;
        afternoon: boolean;
        night: boolean;
    };
    duration_days: number;
    instructions: string;
    warnings: string;
}

interface Prescription {
    medicines: Medicine[];
    follow_up_date: string | null;
    additional_instructions: string[];
    contraindications: string[];
}

interface PrescriptionEditorProps {
    initialPrescription: Prescription;
    onSave: (prescription: Prescription) => void;
    readOnly?: boolean;
    isSaving?: boolean;
}

export const PrescriptionEditor = ({ initialPrescription, onSave, readOnly = false, isSaving = false }: PrescriptionEditorProps) => {
    const [prescription, setPrescription] = useState<Prescription>(initialPrescription);

    const addMedicine = () => {
        setPrescription({
            ...prescription,
            medicines: [
                ...prescription.medicines,
                {
                    name: '',
                    dosage: '',
                    frequency: { morning: false, afternoon: false, night: false },
                    duration_days: 0,
                    instructions: '',
                    warnings: ''
                }
            ]
        });
    };

    const removeMedicine = (index: number) => {
        setPrescription({
            ...prescription,
            medicines: prescription.medicines.filter((_, i) => i !== index)
        });
    };

    const updateMedicine = (index: number, field: keyof Medicine, value: any) => {
        const updated = [...prescription.medicines];
        updated[index] = { ...updated[index], [field]: value };
        setPrescription({ ...prescription, medicines: updated });
    };

    const toggleFrequency = (index: number, time: 'morning' | 'afternoon' | 'night') => {
        const updated = [...prescription.medicines];
        updated[index].frequency[time] = !updated[index].frequency[time];
        setPrescription({ ...prescription, medicines: updated });
    };

    const addInstruction = () => {
        setPrescription({
            ...prescription,
            additional_instructions: [...prescription.additional_instructions, '']
        });
    };

    const updateInstruction = (index: number, value: string) => {
        const updated = [...prescription.additional_instructions];
        updated[index] = value;
        setPrescription({ ...prescription, additional_instructions: updated });
    };

    const removeInstruction = (index: number) => {
        setPrescription({
            ...prescription,
            additional_instructions: prescription.additional_instructions.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-6">
            {/* Medicines */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Medications</CardTitle>
                    {!readOnly && (
                        <Button onClick={addMedicine} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Medicine
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    {prescription.medicines.map((medicine, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <Label>Medicine Name</Label>
                                        <Input
                                            value={medicine.name}
                                            onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                                            placeholder="e.g., Paracetamol"
                                            disabled={readOnly}
                                        />
                                    </div>
                                    <div>
                                        <Label>Dosage</Label>
                                        <Input
                                            value={medicine.dosage}
                                            onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                                            placeholder="e.g., 500mg"
                                            disabled={readOnly}
                                        />
                                    </div>
                                </div>
                                {!readOnly && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeMedicine(index)}
                                        className="ml-2"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                )}
                            </div>

                            <div>
                                <Label>Frequency</Label>
                                <div className="flex gap-2 mt-1">
                                    <Badge
                                        variant={medicine.frequency.morning ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => !readOnly && toggleFrequency(index, 'morning')}
                                    >
                                        Morning
                                    </Badge>
                                    <Badge
                                        variant={medicine.frequency.afternoon ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => !readOnly && toggleFrequency(index, 'afternoon')}
                                    >
                                        Afternoon
                                    </Badge>
                                    <Badge
                                        variant={medicine.frequency.night ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => !readOnly && toggleFrequency(index, 'night')}
                                    >
                                        Night
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <Label>Duration (days)</Label>
                                    <Input
                                        type="number"
                                        value={medicine.duration_days}
                                        onChange={(e) => updateMedicine(index, 'duration_days', parseInt(e.target.value))}
                                        placeholder="e.g., 7"
                                        disabled={readOnly}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label>Instructions</Label>
                                <Textarea
                                    value={medicine.instructions}
                                    onChange={(e) => updateMedicine(index, 'instructions', e.target.value)}
                                    placeholder="e.g., Take after meals"
                                    disabled={readOnly}
                                    rows={2}
                                />
                            </div>

                            <div>
                                <Label>Warnings</Label>
                                <Textarea
                                    value={medicine.warnings}
                                    onChange={(e) => updateMedicine(index, 'warnings', e.target.value)}
                                    placeholder="e.g., Avoid alcohol"
                                    disabled={readOnly}
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Follow-up Date */}
            <Card>
                <CardHeader>
                    <CardTitle>Follow-up</CardTitle>
                </CardHeader>
                <CardContent>
                    <Label>Follow-up Date</Label>
                    <Input
                        type="date"
                        value={prescription.follow_up_date || ''}
                        onChange={(e) => setPrescription({ ...prescription, follow_up_date: e.target.value })}
                        disabled={readOnly}
                    />
                </CardContent>
            </Card>

            {/* Additional Instructions */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Additional Instructions</CardTitle>
                    {!readOnly && (
                        <Button onClick={addInstruction} size="sm" variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Instruction
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="space-y-2">
                    {prescription.additional_instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                value={instruction}
                                onChange={(e) => updateInstruction(index, e.target.value)}
                                placeholder="e.g., Drink plenty of water"
                                disabled={readOnly}
                            />
                            {!readOnly && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeInstruction(index)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Save Button */}
            {!readOnly && (
                <Button
                    onClick={() => onSave(prescription)}
                    className="w-full"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>Saving...</>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Prescription
                        </>
                    )}
                </Button>
            )}
        </div>
    );
};
