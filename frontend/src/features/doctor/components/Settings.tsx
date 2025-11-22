import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, Bell, Shield, LogOut, Save, Edit2, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const Settings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Arun',
    lastName: 'Gupta',
    email: 'dr.arun.gupta@telemedicai.com',
    phone: '+91 98765 43210',
    specialization: 'General Physician',
    clinic: 'City Medical Center',
    address: '123 Medical Plaza, Mumbai, India',
    licenseNumber: 'MCI/2018/45678',
    experience: '12 years'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // API call would go here
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>
      </motion.div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <Button
                  variant={isEditing ? 'default' : 'outline'}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  AG
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Dr. {formData.firstName} {formData.lastName}</h3>
                  <p className="text-muted-foreground">{formData.specialization}</p>
                  <p className="text-sm text-muted-foreground mt-1">License: {formData.licenseNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Specialization</label>
                  <Input
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Experience
                  </label>
                  <Input
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Clinic Name</label>
                  <Input
                    name="clinic"
                    value={formData.clinic}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Settings
              </h2>

              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">Update your password regularly to keep your account secure</p>
                  <Button className="bg-gradient-to-r from-primary to-accent">
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Enable 2FA
                  </Button>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold mb-2">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground mb-4">Manage your active login sessions</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-sm">Current Session - Chrome on Windows</span>
                      <span className="text-xs text-muted-foreground">Active now</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-sm">Mobile App - iPhone</span>
                      <Button variant="outline" size="sm">Sign Out</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  { title: 'New Appointment', description: 'Get notified when a patient books an appointment' },
                  { title: 'Patient Messages', description: 'Receive alerts for new patient messages' },
                  { title: 'Lab Reports', description: 'Notifications when lab reports are ready' },
                  { title: 'Follow-up Reminders', description: 'Reminders for patient follow-ups' },
                  { title: 'System Updates', description: 'Important platform updates and maintenance notices' }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{notification.title}</h3>
                      <p className="text-sm text-muted-foreground">{notification.description}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="mt-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-6 border-0 shadow-lg">
              <h2 className="text-xl font-semibold mb-6">Preferences</h2>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select className="w-full mt-2 p-2 border rounded-lg">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Time Zone</label>
                  <select className="w-full mt-2 p-2 border rounded-lg">
                    <option>IST (India Standard Time)</option>
                    <option>UTC</option>
                    <option>EST</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Consultation Duration (Default)</label>
                  <select className="w-full mt-2 p-2 border rounded-lg">
                    <option>15 minutes</option>
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Default Consultation Fee</label>
                  <Input type="number" placeholder="₹" defaultValue="500" className="mt-2" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className="text-sm text-muted-foreground">Enable dark theme</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 border-0 shadow-lg border-red-200 bg-red-50">
              <h2 className="text-xl font-semibold mb-4 text-red-700">Danger Zone</h2>
              <p className="text-sm text-red-600 mb-4">These actions cannot be undone</p>
              <Button variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout from All Devices
              </Button>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
