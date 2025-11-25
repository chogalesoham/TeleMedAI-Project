import { Navigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const token = localStorage.getItem('admin_token');

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
};

interface AdminLoginRedirectProps {
  children: React.ReactNode;
}

export const AdminLoginRedirect = ({ children }: AdminLoginRedirectProps) => {
  const token = localStorage.getItem('admin_token');

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
