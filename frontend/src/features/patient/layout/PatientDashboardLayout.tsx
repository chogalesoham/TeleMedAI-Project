import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { logout, getStoredUser, getCurrentUser } from '@/services/auth.service';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  FileText,
  Activity,
  Calendar,
  Video,
  Bot,
  MapPin,
  Stethoscope,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pill,
  Upload,
  Apple,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  icon: any;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', path: '/patient-dashboard', icon: Home },
  { name: 'Symptom Intake', path: '/patient-dashboard/symptom-intake', icon: Activity },
  { name: 'Pre-Diagnosis', path: '/patient-dashboard/pre-diagnosis', icon: FileText },
  { name: 'Doctor Selection', path: '/patient-dashboard/doctor-selection', icon: Stethoscope },
  { name: 'My Appointments', path: '/patient-dashboard/my-appointments', icon: Calendar },
  { name: 'Live Consultation', path: '/patient-dashboard/live-consultation', icon: Video },
  { name: 'Medications', path: '/patient-dashboard/medications', icon: Pill },
  { name: 'Report Upload', path: '/patient-dashboard/report-upload', icon: Upload },
  { name: 'AI Chatbot', path: '/patient-dashboard/ai-chatbot', icon: Bot },
  { name: 'Diet & Lifestyle', path: '/patient-dashboard/diet-lifestyle', icon: Apple },
  { name: 'Nearby Clinics', path: '/patient-dashboard/nearby-clinics', icon: MapPin },
];

const PatientDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Desktop sidebar collapse - DEFAULT CLOSED
  const [userData, setUserData] = useState<any>(null); // Real user data from DB
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isActivePath = (path: string) => location.pathname === path;

  // Load user data from localStorage first, then fetch fresh from API
  useEffect(() => {
    const loadUserData = async () => {
      // Get stored user immediately for fast display
      const storedUser = getStoredUser();
      if (storedUser) {
        setUserData(storedUser);
      }

      // Fetch fresh data from API
      try {
        const response = await getCurrentUser();
        console.log('🔥 Dashboard - API Response:', response);
        // API returns { success: true, data: { user: {...}, onboardingCompleted: true } }
        if (response?.success && response?.data?.user) {
          setUserData(response.data.user);
          console.log('✅ Dashboard - User Data Set:', response.data.user);
        } else if (response?.data) {
          // Fallback
          setUserData(response.data);
        }
      } catch (error) {
        console.error('❌ Dashboard - Failed to fetch user data:', error);
        // Keep using stored user data if API fails
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged out successfully',
        description: 'You have been logged out. Redirecting to login...',
      });
      setTimeout(() => {
        navigate('/patient-login');
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Logout successful',
        description: 'Redirecting to login page...',
        variant: 'default',
      });
      setTimeout(() => {
        navigate('/patient-login');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link to="/patient-dashboard" className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">TeleMed</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 h-9 sm:h-10">
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={userData?.avatar} alt={userData?.name || 'User'} />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {userData?.name
                        ? userData.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                        : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-xs sm:text-sm font-medium max-w-[100px] truncate">
                    {userData?.name || 'Loading...'}
                  </span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userData?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{userData?.email || 'No email'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/patient-dashboard/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/patient-dashboard/settings" className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/patient-dashboard/support" className="flex items-center gap-2 cursor-pointer">
                    <HelpCircle className="h-4 w-4" />
                    <span>Support</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 sm:top-16 left-0 bottom-0 bg-white border-r border-gray-200 z-40 
          transition-all duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64 sm:w-72
        `}
      >
        {/* Sidebar Header with Branding */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">

              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Patient Portal</span>
                <span className="text-xs text-gray-500">Health Dashboard</span>
              </div>
            </div>
          )}

          {/* Desktop Collapse Toggle Button - Enhanced Attractive Design */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              hidden lg:flex h-10 w-10 rounded-full transition-all duration-300 flex-shrink-0
              ${sidebarCollapsed
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md hover:shadow-lg'
              }
              hover:scale-110 active:scale-95
            `}
            title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-white font-bold" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-700 font-bold" />
            )}
          </Button>

        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${active
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                  ${sidebarCollapsed ? 'lg:justify-center' : ''}
                `}
                title={sidebarCollapsed ? item.name : ''}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`${sidebarCollapsed ? 'lg:hidden' : ''} whitespace-nowrap`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`
          pt-14 sm:pt-16 min-h-screen transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        `}
      >
        <div className="p-3 sm:p-4 md:p-6 max-w-[100vw] overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PatientDashboardLayout;
