import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Moon,
  Globe,
  Shield,
  Eye,
  Download,
  Trash2,
  Smartphone,
  Mail,
  Calendar,
  CreditCard,
  AlertCircle,
  Check,
  Sun,
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    appointmentReminders: true,
    medicationReminders: true,
    healthTips: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    consultationUpdates: true,
    labResults: true,
  });
  const [privacy, setPrivacy] = useState({
    shareHealthData: false,
    analyticsTracking: true,
    personalizedAds: false,
    dataBackup: true,
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('America/New_York');

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
    toast({
      title: 'Notification Updated',
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy({ ...privacy, [key]: value });
    toast({
      title: 'Privacy Setting Updated',
      description: `${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: 'Theme Changed',
      description: `Switched to ${!isDarkMode ? 'dark' : 'light'} mode`,
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data is being prepared for download. This may take a few minutes.',
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: 'destructive',
      title: 'Account Deletion',
      description: 'Please contact support to delete your account.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <SettingsIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences and settings</p>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 text-indigo-600" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-600" />
                )}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Theme</Label>
                  <p className="text-sm text-gray-500">
                    Choose between light and dark mode
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Sun className="h-4 w-4 text-gray-400" />
                  <Switch checked={isDarkMode} onCheckedChange={handleThemeToggle} />
                  <Moon className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="language" className="text-base">
                    Language
                  </Label>
                  <p className="text-sm text-gray-500">Select your preferred language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language" className="w-[180px]">
                    <Globe className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="timezone" className="text-base">
                    Timezone
                  </Label>
                  <p className="text-sm text-gray-500">Set your local timezone</p>
                </div>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="timezone" className="w-[220px]">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Appointment Reminders</Label>
                  <p className="text-sm text-gray-500">Get notified before appointments</p>
                </div>
                <Switch
                  checked={notifications.appointmentReminders}
                  onCheckedChange={(checked) =>
                    handleNotificationChange('appointmentReminders', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Medication Reminders</Label>
                  <p className="text-sm text-gray-500">Never miss your medication</p>
                </div>
                <Switch
                  checked={notifications.medicationReminders}
                  onCheckedChange={(checked) =>
                    handleNotificationChange('medicationReminders', checked)
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Health Tips</Label>
                  <p className="text-sm text-gray-500">Receive personalized health tips</p>
                </div>
                <Switch
                  checked={notifications.healthTips}
                  onCheckedChange={(checked) => handleNotificationChange('healthTips', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Lab Results</Label>
                  <p className="text-sm text-gray-500">Get notified when results are ready</p>
                </div>
                <Switch
                  checked={notifications.labResults}
                  onCheckedChange={(checked) => handleNotificationChange('labResults', checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4 pt-2">
                <h4 className="font-semibold text-gray-900">Notification Channels</h4>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <Label>Email Notifications</Label>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('emailNotifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <Label>SMS Notifications</Label>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('smsNotifications', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleNotificationChange('pushNotifications', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-green-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Share Health Data</Label>
                  <p className="text-sm text-gray-500">
                    Allow anonymized data for medical research
                  </p>
                </div>
                <Switch
                  checked={privacy.shareHealthData}
                  onCheckedChange={(checked) => handlePrivacyChange('shareHealthData', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Analytics Tracking</Label>
                  <p className="text-sm text-gray-500">Help us improve the app experience</p>
                </div>
                <Switch
                  checked={privacy.analyticsTracking}
                  onCheckedChange={(checked) => handlePrivacyChange('analyticsTracking', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Personalized Ads</Label>
                  <p className="text-sm text-gray-500">Show relevant health content</p>
                </div>
                <Switch
                  checked={privacy.personalizedAds}
                  onCheckedChange={(checked) => handlePrivacyChange('personalizedAds', checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">Automatic Data Backup</Label>
                  <p className="text-sm text-gray-500">Secure cloud backup of your health data</p>
                </div>
                <Switch
                  checked={privacy.dataBackup}
                  onCheckedChange={(checked) => handlePrivacyChange('dataBackup', checked)}
                />
              </div>

              <Separator />

              <div className="pt-2 space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="#">
                    <Eye className="h-4 w-4 mr-2" />
                    View Privacy Policy
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="#">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                Account Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>

              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing & Payments
                </a>
              </Button>

              <Separator />

              <div className="pt-2 space-y-2">
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-900">Danger Zone</p>
                    <p className="text-xs text-red-700 mt-1">
                      Deleting your account is permanent and cannot be undone
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end"
        >
          <Button
            size="lg"
            className="px-8"
            onClick={() =>
              toast({
                title: 'Settings Saved',
                description: 'Your preferences have been saved successfully.',
              })
            }
          >
            <Check className="h-5 w-5 mr-2" />
            Save All Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
