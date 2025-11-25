import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Check if token exists
  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  // Check if user data exists and has admin role
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        // Not an admin, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/admin-login" replace />;
      }
    } catch (error) {
      // Invalid user data, redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/admin-login" replace />;
    }
  } else {
    // No user data, redirect to login
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

interface AdminLoginRedirectProps {
  children: React.ReactNode;
}

export const AdminLoginRedirect = ({ children }: AdminLoginRedirectProps) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // If token exists and user is admin, redirect to dashboard
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } catch (error) {
      // Invalid user data, stay on login page
      console.error('Error parsing user data:', error);
    }
  }

  return <>{children}</>;
};
