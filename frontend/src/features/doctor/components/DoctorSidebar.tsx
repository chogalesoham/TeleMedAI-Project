import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut, 
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    path: '/doctor-dashboard',
    description: 'Dashboard overview'
  },
  {
    title: 'Patient Queue',
    icon: Users,
    path: '/doctor-dashboard/patients',
    description: 'AI triage queue'
  },
  {
    title: 'Appointments',
    icon: Calendar,
    path: '/doctor-dashboard/appointments',
    description: 'Schedule & calendar'
  },
  {
    title: 'Reports',
    icon: FileText,
    path: '/doctor-dashboard/reports',
    description: 'Patient reports'
  },
  {
    title: 'Analytics',
    icon: BarChart3,
    path: '/doctor-dashboard/analytics',
    description: 'Practice insights'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/doctor-dashboard/settings',
    description: 'Account settings'
  }
];

interface DoctorSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const DoctorSidebar = ({ isOpen, setIsOpen }: DoctorSidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`w-72 bg-white border-r border-gray-200 shadow-xl fixed h-full z-50 top-0 left-0 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Dr. Arun Gupta</h3>
                <p className="text-xs text-gray-500">General Physician</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-gray-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
