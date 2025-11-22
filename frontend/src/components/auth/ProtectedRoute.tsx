import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 * Preserves the intended destination for redirect after login.
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  
  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole'); // 'patient' or 'doctor'

  if (!isAuthenticated) {
    // Redirect to login, but save the location they were trying to go to
    return <Navigate to="/patient-login" state={{ from: location }} replace />;
  }

  // Optional: Check if user has correct role
  if (location.pathname.startsWith('/patient') && userRole !== 'patient') {
    return <Navigate to="/patient-login" replace />;
  }

  if (location.pathname.startsWith('/doctor') && userRole !== 'doctor') {
    return <Navigate to="/doctor-login" replace />;
  }

  return <>{children}</>;
};

/**
 * PublicRoute Component
 * 
 * Routes that should only be accessible when NOT authenticated (login, signup)
 * Redirects to dashboard if already authenticated
 */
interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean;
}

export const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = localStorage.getItem('userRole');

  // If authenticated and trying to access restricted route (login/signup), redirect to dashboard
  if (isAuthenticated && restricted) {
    if (userRole === 'patient') {
      return <Navigate to="/patient-dashboard" replace />;
    }
    if (userRole === 'doctor') {
      return <Navigate to="/doctor-dashboard" replace />;
    }
  }

  return <>{children}</>;
};
