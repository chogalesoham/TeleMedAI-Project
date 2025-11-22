// Dashboard Layout - For patient and doctor dashboards
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen">
      {/* Future: Add sidebar, header, notifications here */}
      <Outlet />
    </div>
  );
};
