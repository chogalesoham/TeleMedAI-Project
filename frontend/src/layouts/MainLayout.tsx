// Main Layout - Shows navbar on specific pages
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';

export const MainLayout = () => {
  const location = useLocation();
  
  // Routes where navbar should be hidden
  const hideNavbarRoutes = [
    '/patient-login',
    '/patient-signup',
    '/doctor-login',
    '/doctor-signup',
    '/patient-dashboard',
    '/doctor-dashboard',
  ];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Outlet />
    </>
  );
};
