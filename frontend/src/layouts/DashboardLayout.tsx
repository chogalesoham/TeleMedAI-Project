// Dashboard Layout - For patient and doctor dashboards
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DoctorSidebar } from '@/features/doctor/components/DoctorSidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isDoctorDashboard = location.pathname.includes('/doctor-dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/20 to-cyan-50/20">
      {/* Doctor Sidebar - Only show on doctor routes */}
      {isDoctorDashboard && (
        <>
          <DoctorSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          {/* Menu Toggle Button - Always visible */}
          <div className="fixed top-4 left-4 z-40">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-md"
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Content - No left margin since sidebar is closed by default */}
          <div className="ml-0">
            <Outlet />
          </div>
        </>
      )}

      {/* Non-doctor routes */}
      {!isDoctorDashboard && (
        <Outlet />
      )}
    </div>
  );
};
