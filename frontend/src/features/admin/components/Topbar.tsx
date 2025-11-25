import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TopbarProps {
  onMenuClick: () => void;
}

export const Topbar = ({ onMenuClick }: TopbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin token
    localStorage.removeItem('admin_token');
    // Redirect to admin login page
    navigate('/admin-login');
  };
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3.5 lg:px-6 xl:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-3 md:gap-4 flex-1">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden hover:bg-gray-100 rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search Bar */}
          <div className="relative hidden md:block w-full max-w-xl">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search patients, doctors, appointments..."
              className="pl-10 pr-4 bg-gray-50/50 border-gray-200 rounded-xl h-11 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100 rounded-xl">
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 rounded-xl">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 sm:w-96 shadow-xl border-gray-200/50">
              <DropdownMenuLabel className="text-base font-bold">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start py-3.5 cursor-pointer hover:bg-blue-50/50">
                  <div className="font-semibold text-gray-900">New Doctor Registration</div>
                  <div className="text-xs text-gray-600 mt-1">Dr. Sarah Johnson requested approval</div>
                  <div className="text-xs text-blue-600 font-medium mt-1.5">5 minutes ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3.5 cursor-pointer hover:bg-blue-50/50">
                  <div className="font-semibold text-gray-900">Appointment Cancelled</div>
                  <div className="text-xs text-gray-600 mt-1">Patient ID #1234 cancelled appointment</div>
                  <div className="text-xs text-gray-500 font-medium mt-1.5">1 hour ago</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start py-3.5 cursor-pointer hover:bg-blue-50/50">
                  <div className="font-semibold text-gray-900">New Payment Received</div>
                  <div className="text-xs text-gray-600 mt-1">$150 payment processed successfully</div>
                  <div className="text-xs text-gray-500 font-medium mt-1.5">2 hours ago</div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 rounded-xl px-2 sm:px-3">
                <Avatar className="w-9 h-9 ring-2 ring-gray-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block font-semibold text-sm text-gray-700">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 shadow-xl border-gray-200/50">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1 px-1">
                  <p className="text-sm font-bold text-gray-900">Administrator</p>
                  <p className="text-xs text-gray-500 font-medium">admin@telemedai.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                <User className="w-4 h-4 mr-3 text-gray-500" />
                <span className="font-medium">Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50">
                <Bell className="w-4 h-4 mr-3 text-gray-500" />
                <span className="font-medium">Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-red-50 text-red-600 font-semibold focus:bg-red-50 focus:text-red-700"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
