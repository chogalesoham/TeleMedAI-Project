import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { getStoredUser, getCurrentUser, updateProfile } from '@/services/auth.service';
import { getOnboardingData, updateMedicalInfo } from '@/services/onboarding.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Heart,
  AlertCircle,
  Users,
  Camera,
  Save,
  Edit3,
  X,
  Plus,
  Trash2,
  Shield,
  Activity,
  Apple,
} from 'lucide-react';
import { mockUserProfile } from '../data/mockData';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Basic Profile Data
  const [profileData, setProfileData] = useState<any>(null);
  const [originalProfileData, setOriginalProfileData] = useState<any>(null);
  
  // Onboarding Data
  const [onboardingData, setOnboardingData] = useState<any>(null);
  
  // Basic Health Profile
  const [height, setHeight] = useState<any>({ value: '', unit: 'cm' });
  const [originalHeight, setOriginalHeight] = useState<any>({ value: '', unit: 'cm' });
  const [weight, setWeight] = useState<any>({ value: '', unit: 'kg' });
  const [originalWeight, setOriginalWeight] = useState<any>({ value: '', unit: 'kg' });
  const [bloodGroup, setBloodGroup] = useState('');
  const [originalBloodGroup, setOriginalBloodGroup] = useState('');
  
  // Medical History
  const [allergies, setAllergies] = useState<string[]>([]);
  const [originalAllergies, setOriginalAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [originalChronicConditions, setOriginalChronicConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState('');
  const [currentMedications, setCurrentMedications] = useState<any[]>([]);
  const [originalCurrentMedications, setOriginalCurrentMedications] = useState<any[]>([]);
  
  // Lifestyle
  const [smokingStatus, setSmokingStatus] = useState('Never');
  const [originalSmokingStatus, setOriginalSmokingStatus] = useState('Never');
  const [alcoholConsumption, setAlcoholConsumption] = useState('Never');
  const [originalAlcoholConsumption, setOriginalAlcoholConsumption] = useState('Never');
  const [exerciseFrequency, setExerciseFrequency] = useState('None');
  const [originalExerciseFrequency, setOriginalExerciseFrequency] = useState('None');
  const [dietType, setDietType] = useState('Regular');
  const [originalDietType, setOriginalDietType] = useState('Regular');
  const [sleepHours, setSleepHours] = useState<any>({ average: '', quality: 'Good' });
  const [originalSleepHours, setOriginalSleepHours] = useState<any>({ average: '', quality: 'Good' });
  
  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [originalEmergencyContacts, setOriginalEmergencyContacts] = useState<EmergencyContact[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user from localStorage first (fast)
      const storedUser = getStoredUser();
      console.log('📦 Stored User:', storedUser);
      if (storedUser) {
        setProfileData(storedUser);
      }

      // Try to get fresh user data from API
      try {
        const currentUserResponse = await getCurrentUser();
        console.log('🔥 API User Response:', currentUserResponse);
        // API returns { success: true, data: { user: {...}, onboardingCompleted: true } }
        if (currentUserResponse?.success && currentUserResponse?.data?.user) {
          const userData = currentUserResponse.data.user;
          setProfileData(userData);
          setOriginalProfileData({...userData}); // Store original for cancel
          console.log('✅ Profile Data Set:', userData);
        } else if (currentUserResponse?.data) {
          // Fallback in case structure is different
          setProfileData(currentUserResponse.data);
          setOriginalProfileData({...currentUserResponse.data});
          console.log('✅ Profile Data Set (fallback):', currentUserResponse.data);
        }
      } catch (apiError) {
        console.log('⚠️ API Error, using stored user data:', apiError);
      }

      // Get onboarding data (medical history, allergies, emergency contacts, etc.)
      try {
        const onboardingResponse = await getOnboardingData();
        console.log('🏥 Onboarding Response:', onboardingResponse);
        if (onboardingResponse?.success && onboardingResponse?.data) {
          const data = onboardingResponse.data;
          setOnboardingData(data);
          console.log('✅ Onboarding Data Set:', data);

          // ===== Extract Basic Health Profile =====
          if (data.basicHealthProfile) {
            const h = data.basicHealthProfile.height || { value: '', unit: 'cm' };
            const w = data.basicHealthProfile.weight || { value: '', unit: 'kg' };
            const bg = data.basicHealthProfile.bloodGroup || '';
            
            setHeight(h);
            setOriginalHeight({...h});
            setWeight(w);
            setOriginalWeight({...w});
            setBloodGroup(bg);
            setOriginalBloodGroup(bg);
          }

          // ===== Extract Medical History - Allergies =====
          if (data.currentHealthStatus?.allergies) {
            const allergyList = data.currentHealthStatus.allergies.map((a: any) => a.allergen).filter(Boolean);
            setAllergies(allergyList);
            setOriginalAllergies([...allergyList]);
          }

          // ===== Extract Medical History - Chronic Diseases =====
          if (data.medicalHistory?.chronicDiseases) {
            const conditionsList = data.medicalHistory.chronicDiseases.map((d: any) => d.name).filter(Boolean);
            setChronicConditions(conditionsList);
            setOriginalChronicConditions([...conditionsList]);
          }

          // ===== Extract Current Medications =====
          if (data.currentHealthStatus?.currentMedications) {
            setCurrentMedications(data.currentHealthStatus.currentMedications);
            setOriginalCurrentMedications([...data.currentHealthStatus.currentMedications]);
          }

          // ===== Extract Lifestyle Data =====
          if (data.currentHealthStatus) {
            const smoking = data.currentHealthStatus.smokingStatus || 'Never';
            const alcohol = data.currentHealthStatus.alcoholConsumption || 'Never';
            const exercise = data.currentHealthStatus.exerciseFrequency || 'None';
            const diet = data.currentHealthStatus.dietType || 'Regular';
            const sleep = data.currentHealthStatus.sleepHours || { average: '', quality: 'Good' };
            
            setSmokingStatus(smoking);
            setOriginalSmokingStatus(smoking);
            setAlcoholConsumption(alcohol);
            setOriginalAlcoholConsumption(alcohol);
            setExerciseFrequency(exercise);
            setOriginalExerciseFrequency(exercise);
            setDietType(diet);
            setOriginalDietType(diet);
            setSleepHours(sleep);
            setOriginalSleepHours({...sleep});
          }

          // Extract emergency contacts
          if (data.telemedicinePreferences?.emergencyContacts) {
            const contacts = data.telemedicinePreferences.emergencyContacts;
            const contactsList: EmergencyContact[] = [];
            
            if (contacts.primaryContact?.name) {
              contactsList.push({
                id: '1',
                name: contacts.primaryContact.name,
                relationship: contacts.primaryContact.relationship || 'Primary Contact',
                phone: contacts.primaryContact.phone || 'N/A'
              });
            }
            
            if (contacts.secondaryContact?.name) {
              contactsList.push({
                id: '2',
                name: contacts.secondaryContact.name,
                relationship: contacts.secondaryContact.relationship || 'Secondary Contact',
                phone: contacts.secondaryContact.phone || 'N/A'
              });
            }
            
            setEmergencyContacts(contactsList);
            setOriginalEmergencyContacts([...contactsList]);
          }
        }
      } catch (onboardingError) {
        console.log('No onboarding data available');
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // 1. Update basic profile data
      const profileUpdateData = {
        name: profileData.name,
        phone: profileData.phone,
        dateOfBirth: profileData.dateOfBirth,
        gender: profileData.gender,
        location: profileData.location,
        profilePicture: profileData.profilePicture
      };

      const profileResponse = await updateProfile(profileUpdateData);
      
      if (profileResponse.success) {
        // 2. Update ALL medical/onboarding information
        const medicalUpdateData = {
          // Basic Health Profile
          height: height,
          weight: weight,
          bloodGroup: bloodGroup,
          
          // Medical History
          allergies: allergies,
          chronicConditions: chronicConditions,
          currentMedications: currentMedications,
          
          // Lifestyle
          smokingStatus: smokingStatus,
          alcoholConsumption: alcoholConsumption,
          exerciseFrequency: exerciseFrequency,
          dietType: dietType,
          sleepHours: sleepHours,
          
          // Emergency Contacts
          emergencyContacts: emergencyContacts.map(contact => ({
            name: contact.name,
            relationship: contact.relationship,
            phone: contact.phone
          }))
        };

        try {
          await updateMedicalInfo(medicalUpdateData);
        } catch (medicalError) {
          console.log('Medical info update skipped (may not exist yet):', medicalError);
        }

        // 3. Update all original data with new values
        setOriginalProfileData({...profileData});
        setOriginalHeight({...height});
        setOriginalWeight({...weight});
        setOriginalBloodGroup(bloodGroup);
        setOriginalAllergies([...allergies]);
        setOriginalChronicConditions([...chronicConditions]);
        setOriginalCurrentMedications([...currentMedications]);
        setOriginalSmokingStatus(smokingStatus);
        setOriginalAlcoholConsumption(alcoholConsumption);
        setOriginalExerciseFrequency(exerciseFrequency);
        setOriginalDietType(dietType);
        setOriginalSleepHours({...sleepHours});
        setOriginalEmergencyContacts([...emergencyContacts]);

        setIsEditing(false);
        toast({
          title: 'Profile Updated! ✅',
          description: 'Your profile and medical information has been saved successfully.',
        });

        // 4. Reload data to ensure sync with database
        await loadUserData();
      }
    } catch (error: any) {
      console.error('Save error:', error);
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Restore ALL original data
    if (originalProfileData) {
      setProfileData({...originalProfileData});
    }
    setHeight({...originalHeight});
    setWeight({...originalWeight});
    setBloodGroup(originalBloodGroup);
    setAllergies([...originalAllergies]);
    setChronicConditions([...originalChronicConditions]);
    setCurrentMedications([...originalCurrentMedications]);
    setSmokingStatus(originalSmokingStatus);
    setAlcoholConsumption(originalAlcoholConsumption);
    setExerciseFrequency(originalExerciseFrequency);
    setDietType(originalDietType);
    setSleepHours({...originalSleepHours});
    setEmergencyContacts([...originalEmergencyContacts]);
    setIsEditing(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setAllergies([...allergies, newAllergy.trim()]);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const addCondition = () => {
    if (newCondition.trim()) {
      setChronicConditions([...chronicConditions, newCondition.trim()]);
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setChronicConditions(chronicConditions.filter((c) => c !== condition));
  };

  const addEmergencyContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: '',
      relationship: '',
      phone: '',
    };
    setEmergencyContacts([...emergencyContacts, newContact]);
  };

  const updateEmergencyContact = (id: string, field: string, value: string) => {
    setEmergencyContacts(
      emergencyContacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  };

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter((contact) => contact.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-red-600" />
          <p className="text-gray-600">Failed to load profile data</p>
          <Button onClick={loadUserData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="mx-auto space-y-6">
        {/* Debug Info - Remove after testing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-xs">
            <strong>Debug Info:</strong>
            <pre className="mt-2 overflow-auto max-h-40">
              {JSON.stringify({ 
                hasProfileData: !!profileData,
                profileDataKeys: profileData ? Object.keys(profileData) : [],
                name: profileData?.name,
                email: profileData?.email,
                phone: profileData?.phone
              }, null, 2)}
            </pre>
          </div>
        )}
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">Manage your personal and medical information</p>
            </div>
          </div>

          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>

        {/* Profile Picture & Basic Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    <AvatarImage src={profileData.profilePicture || profileData.avatar} alt={profileData.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      {profileData.name
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{profileData.name}</h3>
                  <p className="text-gray-600">{profileData.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      {profileData.isEmailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                    {profileData.onboardingCompleted && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Onboarding Complete
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profileData?.name || ''}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData?.email || ''}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData?.phone || ''}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dob"
                      type="date"
                      value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString().split('T')[0] : ''}
                      onChange={(e) =>
                        setProfileData({ ...profileData, dateOfBirth: e.target.value })
                      }
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={profileData.gender || 'Not specified'}
                    onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select
                    value={bloodGroup || 'Unknown'}
                    onValueChange={(value) => setBloodGroup(value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="bloodType">
                      <SelectValue />
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    value={profileData.location ? 
                      `${profileData.location.city || ''} ${profileData.location.state || ''} ${profileData.location.country || ''} ${profileData.location.zipCode || ''}`.trim() 
                      : 'Not specified'}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10 min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Basic Health Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Basic Health Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={height.value || ''}
                      onChange={(e) => setHeight({ ...height, value: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    <Select
                      value={height.unit}
                      onValueChange={(value) => setHeight({ ...height, unit: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-20">
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
                  <Label htmlFor="weight">Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={weight.value || ''}
                      onChange={(e) => setWeight({ ...weight, value: e.target.value })}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                    <Select
                      value={weight.unit}
                      onValueChange={(value) => setWeight({ ...weight, unit: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="lbs">lbs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* BMI (calculated) */}
                <div className="space-y-2">
                  <Label>BMI</Label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center text-gray-700">
                    {height.value && weight.value ? (
                      (() => {
                        const h = height.unit === 'cm' ? height.value / 100 : height.value * 0.3048;
                        const w = weight.unit === 'kg' ? weight.value : weight.value * 0.453592;
                        const bmi = (w / (h * h)).toFixed(1);
                        return `${bmi} ${parseFloat(bmi) < 18.5 ? '(Underweight)' : parseFloat(bmi) < 25 ? '(Normal)' : parseFloat(bmi) < 30 ? '(Overweight)' : '(Obese)'}`;
                      })()
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medical History & Lifestyle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Medical History & Lifestyle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Allergies */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <Label className="text-base font-semibold">Allergies</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="px-3 py-1">
                      {allergy}
                      {isEditing && (
                        <button
                          onClick={() => removeAllergy(allergy)}
                          className="ml-2 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {allergies.length === 0 && (
                    <span className="text-sm text-gray-500">No allergies recorded</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new allergy"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                    />
                    <Button onClick={addAllergy} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Chronic Conditions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <Label className="text-base font-semibold">Chronic Conditions</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {chronicConditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="px-3 py-1">
                      {condition}
                      {isEditing && (
                        <button
                          onClick={() => removeCondition(condition)}
                          className="ml-2 hover:text-gray-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                  {chronicConditions.length === 0 && (
                    <span className="text-sm text-gray-500">No chronic conditions recorded</span>
                  )}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add chronic condition"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addCondition()}
                    />
                    <Button onClick={addCondition} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Lifestyle Information */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Apple className="h-5 w-5 text-green-600" />
                  Lifestyle & Habits
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Smoking Status */}
                  <div className="space-y-2">
                    <Label htmlFor="smoking">Smoking Status</Label>
                    <Select
                      value={smokingStatus}
                      onValueChange={setSmokingStatus}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="smoking">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Former">Former</SelectItem>
                        <SelectItem value="Current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Alcohol Consumption */}
                  <div className="space-y-2">
                    <Label htmlFor="alcohol">Alcohol Consumption</Label>
                    <Select
                      value={alcoholConsumption}
                      onValueChange={setAlcoholConsumption}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="alcohol">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never">Never</SelectItem>
                        <SelectItem value="Occasionally">Occasionally</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Heavy">Heavy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Exercise Frequency */}
                  <div className="space-y-2">
                    <Label htmlFor="exercise">Exercise Frequency</Label>
                    <Select
                      value={exerciseFrequency}
                      onValueChange={setExerciseFrequency}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="exercise">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="1-2 times/week">1-2 times/week</SelectItem>
                        <SelectItem value="3-4 times/week">3-4 times/week</SelectItem>
                        <SelectItem value="5+ times/week">5+ times/week</SelectItem>
                        <SelectItem value="Daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Diet Type */}
                  <div className="space-y-2">
                    <Label htmlFor="diet">Diet Type</Label>
                    <Select
                      value={dietType}
                      onValueChange={setDietType}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="diet">
                        <SelectValue />
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
                  <div className="space-y-2">
                    <Label htmlFor="sleep">Average Sleep (hours/night)</Label>
                    <Input
                      id="sleep"
                      type="number"
                      placeholder="7-8"
                      value={sleepHours.average || ''}
                      onChange={(e) => setSleepHours({ ...sleepHours, average: e.target.value })}
                      disabled={!isEditing}
                      min="0"
                      max="24"
                    />
                  </div>

                  {/* Sleep Quality */}
                  <div className="space-y-2">
                    <Label htmlFor="sleepQuality">Sleep Quality</Label>
                    <Select
                      value={sleepHours.quality}
                      onValueChange={(value) => setSleepHours({ ...sleepHours, quality: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger id="sleepQuality">
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Emergency Contacts
                </CardTitle>
                {isEditing && (
                  <Button onClick={addEmergencyContact} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div key={contact.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">
                      Contact {index + 1}
                    </span>
                    {isEditing && (
                      <Button
                        onClick={() => removeEmergencyContact(contact.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={contact.name}
                        onChange={(e) =>
                          updateEmergencyContact(contact.id, 'name', e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="Full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Input
                        value={contact.relationship}
                        onChange={(e) =>
                          updateEmergencyContact(contact.id, 'relationship', e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="e.g., Spouse, Parent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={contact.phone}
                        onChange={(e) =>
                          updateEmergencyContact(contact.id, 'phone', e.target.value)
                        }
                        disabled={!isEditing}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
