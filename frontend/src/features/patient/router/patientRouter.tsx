import { createBrowserRouter, Navigate } from 'react-router-dom';
import PatientDashboardLayout from '../layout/PatientDashboardLayout';
import {
  DashboardHome,
  SymptomIntake,
  PreDiagnosis,
  DoctorSelection,
  DoctorProfile,
  AppointmentBooking,
  LiveConsultation,
  ConsultationSummary,
  Medications,
  ReportUpload,
  AIChatbot,
  DietLifestyle,
  NearbyClinics,
  Profile,
  Settings,
  Support,
  Logout,
} from '../pages';

/**
 * Patient Dashboard Router Configuration
 * 
 * All 19 pages are configured with the PatientDashboardLayout wrapper
 * which provides consistent navigation and structure.
 * 
 * Route Structure:
 * - /patient/* - All patient dashboard routes
 * - Authentication required (implement auth check in ProtectedRoute)
 */

export const patientRouter = createBrowserRouter([
  {
    path: '/patient',
    element: <PatientDashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/patient/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardHome />,
      },
      {
        path: 'symptoms',
        element: <SymptomIntake />,
      },
      {
        path: 'pre-diagnosis',
        element: <PreDiagnosis />,
      },
      {
        path: 'doctors',
        element: <DoctorSelection />,
      },
      {
        path: 'doctor/:id',
        element: <DoctorProfile />,
      },
      {
        path: 'book-appointment',
        element: <AppointmentBooking />,
      },
      {
        path: 'consultation',
        element: <LiveConsultation />,
      },
      {
        path: 'consultation-summary',
        element: <ConsultationSummary />,
      },
      {
        path: 'medications',
        element: <Medications />,
      },
      {
        path: 'upload-reports',
        element: <ReportUpload />,
      },
      {
        path: 'ai-chatbot',
        element: <AIChatbot />,
      },
      {
        path: 'diet-lifestyle',
        element: <DietLifestyle />,
      },
      {
        path: 'nearby-clinics',
        element: <NearbyClinics />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'support',
        element: <Support />,
      },
      {
        path: 'logout',
        element: <Logout />,
      },
    ],
  },
]);

/**
 * Route Configuration Notes:
 * 
 * 1. All routes use the PatientDashboardLayout wrapper for consistent UI
 * 2. Default redirect from /patient to /patient/dashboard
 * 3. Authentication can be added by wrapping routes with ProtectedRoute component
 * 4. Breadcrumb navigation can be automatically generated from route paths
 * 
 * Usage in main App:
 * ```tsx
 * import { RouterProvider } from 'react-router-dom';
 * import { patientRouter } from './features/patient/router/patientRouter';
 * 
 * function App() {
 *   return <RouterProvider router={patientRouter} />;
 * }
 * ```
 * 
 * For authentication protection, create a ProtectedRoute component:
 * ```tsx
 * const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
 *   const isAuthenticated = // check auth state
 *   return isAuthenticated ? children : <Navigate to="/patient-login" />;
 * };
 * ```
 */

export default patientRouter;
