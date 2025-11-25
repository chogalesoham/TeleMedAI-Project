import { RouteObject } from 'react-router-dom';
import { AdminProtectedRoute, AdminLoginRedirect } from '@/components/auth/AdminProtectedRoute';
import { AdminLayout } from '@/features/admin/layouts/AdminLayout';
import { AdminLogin } from '@/features/admin/pages/AdminLogin';
import { Dashboard } from '@/features/admin/pages/Dashboard';
import { Doctors } from '@/features/admin/pages/Doctors';
import { DoctorDetails } from '@/features/admin/pages/DoctorDetails';
import { Patients } from '@/features/admin/pages/Patients';
import { PatientDetails } from '@/features/admin/pages/PatientDetails';
import { Appointments } from '@/features/admin/pages/Appointments';
import { Revenue } from '@/features/admin/pages/Revenue';
import { Settings } from '@/features/admin/pages/Settings';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin-login',
    element: (
      <AdminLoginRedirect>
        <AdminLogin />
      </AdminLoginRedirect>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminLayout />
      </AdminProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'doctors',
        element: <Doctors />,
      },
      {
        path: 'doctors/:id',
        element: <DoctorDetails />,
      },
      {
        path: 'patients',
        element: <Patients />,
      },
      {
        path: 'patients/:id',
        element: <PatientDetails />,
      },
      {
        path: 'appointments',
        element: <Appointments />,
      },
      {
        path: 'revenue',
        element: <Revenue />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
];
