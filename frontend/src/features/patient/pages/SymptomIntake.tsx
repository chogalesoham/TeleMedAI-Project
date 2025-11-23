import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Send, Loader2, CheckCircle2, AlertCircle, Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const commonSymptoms = [
  'Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea',
  'Chest Pain', 'Shortness of Breath', 'Dizziness', 'Sore Throat'
];

export const SymptomIntake = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState<'mild' | 'moderate' | 'severe' | null>(null);
  const [customSymptom, setCustomSymptom] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/patient-dashboard/pre-diagnosis', {
      state: { symptoms: selectedSymptoms, description, duration, severity }
    });
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Voice recording logic would go here
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setDescription(prev => prev + ' I have been experiencing headache and fever for 2 days.');
      }, 3000);
    }
  };

  return (
    <div className="mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">AI Symptom Check</h1>
        <p className="text-sm sm:text-base text-gray-600">Describe your symptoms and let our AI help you understand what might be wrong</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
            1
          </div>
          <span className="font-medium text-gray-900 text-xs sm:text-base whitespace-nowrap">Describe Symptoms</span>
        </div>
        <div className="flex-1 min-w-[20px] h-0.5 bg-gray-200" />
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-sm">
            2
          </div>
          <span className="text-gray-500 text-xs sm:text-base whitespace-nowrap">AI Analysis</span>
        </div>
        <div className="flex-1 min-w-[20px] h-0.5 bg-gray-200" />
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-semibold text-sm">
            3
          </div>
          <span className="text-gray-500 text-xs sm:text-base whitespace-nowrap">Pre-Diagnosis</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Text Description */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="description" className="text-sm sm:text-base font-semibold">Describe Your Symptoms</Label>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Tell us what you're experiencing in detail</p>
                </div>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="E.g., I've been having a persistent headache for the past 2 days, accompanied by mild fever..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[120px] sm:min-h-[150px] pr-12 text-sm sm:text-base"
                  />
                  <Button
                    size="icon"
                    variant={isRecording ? 'destructive' : 'outline'}
                    className={`absolute bottom-2 sm:bottom-3 right-2 sm:right-3 h-8 w-8 sm:h-9 sm:w-9 ${isRecording ? 'animate-pulse' : ''}`}
                    onClick={handleVoiceInput}
                  >
                    {isRecording ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
                {isRecording && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-red-600"
                  >
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    Recording... Click again to stop
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Select Symptoms */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label className="text-sm sm:text-base font-semibold">Quick Select Common Symptoms</Label>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Click to add common symptoms</p>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant={selectedSymptoms.includes(symptom) ? 'default' : 'outline'}
                      className="cursor-pointer px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm"
                      onClick={() => toggleSymptom(symptom)}
                    >
                      {selectedSymptoms.includes(symptom) && (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      )}
                      {symptom}
                    </Badge>
                  ))}
                </div>

                {/* Add Custom Symptom */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom symptom..."
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
                  />
                  <Button onClick={addCustomSymptom} size="icon">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selected Symptoms */}
                {selectedSymptoms.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Selected Symptoms ({selectedSymptoms.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <Badge key={symptom} variant="secondary" className="px-3 py-1">
                          {symptom}
                          <X
                            className="w-3 h-3 ml-2 cursor-pointer"
                            onClick={() => toggleSymptom(symptom)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Duration & Severity */}
          <Card>
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">How long have you had these symptoms?</Label>
                  <Input
                    id="duration"
                    placeholder="E.g., 2 days, 1 week"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>How severe are your symptoms?</Label>
                  <div className="flex gap-2">
                    {(['mild', 'moderate', 'severe'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={severity === level ? 'default' : 'outline'}
                        className="flex-1 capitalize"
                        onClick={() => setSeverity(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            size="lg"
            className="w-full"
            disabled={!description && selectedSymptoms.length === 0 || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Get AI Analysis
              </>
            )}
          </Button>
        </div>

        {/* Sidebar - Tips */}
        <div className="space-y-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Tips for Better Results</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Be specific about your symptoms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Mention when symptoms started</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Include any relevant medical history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Note any recent activities or exposures</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">Emergency Warning</h3>
                  <p className="text-sm text-red-800 mb-3">
                    If you're experiencing any of these, seek immediate medical attention:
                  </p>
                  <ul className="space-y-1 text-sm text-red-800">
                    <li>• Severe chest pain</li>
                    <li>• Difficulty breathing</li>
                    <li>• Severe bleeding</li>
                    <li>• Loss of consciousness</li>
                    <li>• Sudden severe headache</li>
                  </ul>
                  <Button variant="destructive" className="w-full mt-4" size="sm">
                    Call Emergency: 911
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
