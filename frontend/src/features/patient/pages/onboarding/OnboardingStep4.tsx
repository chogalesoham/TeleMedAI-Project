import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, User, Phone, Mail, MapPin, Users, ArrowRight, ArrowLeft, Info, Heart } from 'lucide-react';

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
}

interface EmergencyContactData {
  primaryContact: EmergencyContact;
  secondaryContact?: EmergencyContact;
}

interface OnboardingStep4Props {
  onNext: (data: EmergencyContactData) => void;
  onBack: () => void;
  initialData?: EmergencyContactData;
}

const OnboardingStep4: React.FC<OnboardingStep4Props> = ({ onNext, onBack, initialData }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EmergencyContactData>({
    primaryContact: initialData?.primaryContact || {
      name: '',
      relationship: '',
      phone: '',
      alternatePhone: '',
      email: '',
      address: ''
    },
    secondaryContact: initialData?.secondaryContact || undefined
  });

  const [showSecondary, setShowSecondary] = useState(!!initialData?.secondaryContact);

  const updatePrimaryContact = (field: keyof EmergencyContact, value: string) => {
    setFormData({
      ...formData,
      primaryContact: { ...formData.primaryContact, [field]: value }
    });
  };

  const updateSecondaryContact = (field: keyof EmergencyContact, value: string) => {
    setFormData({
      ...formData,
      secondaryContact: {
        ...(formData.secondaryContact || { name: '', relationship: '', phone: '' }),
        [field]: value
      }
    });
  };

  const addSecondaryContact = () => {
    setShowSecondary(true);
    setFormData({
      ...formData,
      secondaryContact: {
        name: '',
        relationship: '',
        phone: '',
        alternatePhone: '',
        email: '',
        address: ''
      }
    });
  };

  const removeSecondaryContact = () => {
    setShowSecondary(false);
    setFormData({
      ...formData,
      secondaryContact: undefined
    });
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
          className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, 60, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-400/15 to-yellow-400/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -50, 0], y: [0, -40, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl">Emergency Contacts</CardTitle>
                <CardDescription className="text-base">
                  Step 4 of 4 • All fields are optional
                </CardDescription>
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-4 bg-red-50/80 border border-red-200/50 rounded-xl">
              <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-900">
                Add people we can contact in case of emergency. This information is kept private and secure.
              </p>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Primary Emergency Contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-red-600" />
                  <Label className="text-lg font-semibold">Primary Emergency Contact</Label>
                  <span className="text-sm text-gray-400">(Optional)</span>
                </div>

                <div className="p-6 bg-gradient-to-r from-red-50/50 to-pink-50/50 border border-red-100 rounded-xl space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-600" />
                        Full Name
                      </Label>
                      <Input
                        placeholder="e.g., John Doe"
                        value={formData.primaryContact.name}
                        onChange={(e) => updatePrimaryContact('name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-gray-600" />
                        Relationship
                      </Label>
                      <Input
                        placeholder="e.g., Spouse, Parent, Sibling"
                        value={formData.primaryContact.relationship}
                        onChange={(e) => updatePrimaryContact('relationship', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-600" />
                        Primary Phone
                      </Label>
                      <Input
                        type="tel"
                        placeholder="e.g., (555) 123-4567"
                        value={formData.primaryContact.phone}
                        onChange={(e) => updatePrimaryContact('phone', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-600" />
                        Alternate Phone
                      </Label>
                      <Input
                        type="tel"
                        placeholder="e.g., (555) 987-6543"
                        value={formData.primaryContact.alternatePhone}
                        onChange={(e) => updatePrimaryContact('alternatePhone', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-600" />
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        placeholder="e.g., john.doe@example.com"
                        value={formData.primaryContact.email}
                        onChange={(e) => updatePrimaryContact('email', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-600" />
                        Address
                      </Label>
                      <Input
                        placeholder="e.g., 123 Main St, City, State, ZIP"
                        value={formData.primaryContact.address}
                        onChange={(e) => updatePrimaryContact('address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Emergency Contact */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    <Label className="text-lg font-semibold">Secondary Emergency Contact</Label>
                    <span className="text-sm text-gray-400">(Optional)</span>
                  </div>
                  {!showSecondary && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSecondaryContact}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Secondary Contact
                    </Button>
                  )}
                </div>

                {!showSecondary && (
                  <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No secondary contact added</p>
                  </div>
                )}

                {showSecondary && formData.secondaryContact && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 bg-gradient-to-r from-orange-50/50 to-yellow-50/50 border border-orange-100 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-sm font-medium">Secondary Contact Details</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeSecondaryContact}
                        className="h-8 px-3 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-600" />
                          Full Name
                        </Label>
                        <Input
                          placeholder="e.g., Jane Smith"
                          value={formData.secondaryContact.name}
                          onChange={(e) => updateSecondaryContact('name', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-gray-600" />
                          Relationship
                        </Label>
                        <Input
                          placeholder="e.g., Friend, Colleague"
                          value={formData.secondaryContact.relationship}
                          onChange={(e) => updateSecondaryContact('relationship', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-600" />
                          Primary Phone
                        </Label>
                        <Input
                          type="tel"
                          placeholder="e.g., (555) 234-5678"
                          value={formData.secondaryContact.phone}
                          onChange={(e) => updateSecondaryContact('phone', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-600" />
                          Alternate Phone
                        </Label>
                        <Input
                          type="tel"
                          placeholder="e.g., (555) 876-5432"
                          value={formData.secondaryContact.alternatePhone}
                          onChange={(e) => updateSecondaryContact('alternatePhone', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-600" />
                          Email Address
                        </Label>
                        <Input
                          type="email"
                          placeholder="e.g., jane.smith@example.com"
                          value={formData.secondaryContact.email}
                          onChange={(e) => updateSecondaryContact('email', e.target.value)}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          Address
                        </Label>
                        <Input
                          placeholder="e.g., 456 Oak Ave, City, State, ZIP"
                          value={formData.secondaryContact.address}
                          onChange={(e) => updateSecondaryContact('address', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
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
                  className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  Complete Onboarding
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

export default OnboardingStep4;
