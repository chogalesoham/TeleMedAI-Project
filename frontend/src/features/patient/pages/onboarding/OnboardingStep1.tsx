import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Heart, Activity, ArrowRight, Ruler, Weight, Droplet, User, Calendar, Info } from 'lucide-react';

interface BasicHealthProfileData {
  height: { value: number; unit: string };
  weight: { value: number; unit: string };
  bloodGroup: string;
  gender: string;
  dateOfBirth: string;
}

interface OnboardingStep1Props {
  onNext: (data: BasicHealthProfileData) => void;
  initialData?: BasicHealthProfileData;
}

const OnboardingStep1: React.FC<OnboardingStep1Props> = ({ onNext, initialData }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<BasicHealthProfileData>({
    height: initialData?.height || { value: 0, unit: 'cm' },
    weight: initialData?.weight || { value: 0, unit: 'kg' },
    bloodGroup: initialData?.bloodGroup || '',
    gender: initialData?.gender || '',
    dateOfBirth: initialData?.dateOfBirth || ''
  });

  const calculateBMI = () => {
    if (formData.height.value && formData.weight.value) {
      let heightInMeters = formData.height.value;
      let weightInKg = formData.weight.value;

      if (formData.height.unit === 'ft') {
        heightInMeters = heightInMeters * 0.3048;
      } else {
        heightInMeters = heightInMeters / 100;
      }

      if (formData.weight.unit === 'lbs') {
        weightInKg = weightInKg * 0.453592;
      }

      return (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // All fields are optional now - just save whatever they provide
    onNext(formData);
  };

  const bmi = calculateBMI();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <motion.div
          className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-xl shadow-2xl border-gray-200/50">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Basic Health Profile</CardTitle>
                <CardDescription className="text-base">
                  Step 1 of 4 • All fields are optional
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-4 bg-blue-50/80 border border-blue-200/50 rounded-xl">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900">
                Help us understand your health better by sharing some basic information. You can skip any field and update it later.
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
          {/* Height & Weight Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-600" />
                Height <span className="text-gray-400 text-sm">(Optional)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter height"
                  value={formData.height.value || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    height: { ...formData.height, value: parseFloat(e.target.value) }
                  })}
                  className="flex-1"
                />
                <Select
                  value={formData.height.unit}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    height: { ...formData.height, unit: value }
                  })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">cm</SelectItem>
                    <SelectItem value="ft">ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-blue-600" />
                Weight <span className="text-gray-400 text-sm">(Optional)</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={formData.weight.value || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    weight: { ...formData.weight, value: parseFloat(e.target.value) }
                  })}
                  className="flex-1"
                />
                <Select
                  value={formData.weight.unit}
                  onValueChange={(value) => setFormData({
                    ...formData,
                    weight: { ...formData.weight, unit: value }
                  })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* BMI Display */}
          {bmi && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Your BMI</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{bmi}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 max-w-[200px]">Body Mass Index calculated from your height and weight</p>
              </div>
            </motion.div>
          )}

          {/* Blood Group & Gender Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                <Droplet className="w-4 h-4 text-red-500" />
                Blood Group <span className="text-gray-400 text-sm">(Optional)</span>
              </Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-500" />
                Gender <span className="text-gray-400 text-sm">(Optional)</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-500" />
              Date of Birth <span className="text-gray-400 text-sm">(Optional)</span>
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              max={new Date().toISOString().split('T')[0]}
              className="w-full"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Medical History
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

export default OnboardingStep1;
