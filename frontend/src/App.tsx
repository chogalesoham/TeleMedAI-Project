import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import { MainLayout, DashboardLayout } from "@/layouts";
import PatientDashboardLayout from "@/features/patient/layout/PatientDashboardLayout";

// Auth Components
import { ProtectedRoute, PublicRoute } from "@/components/auth/ProtectedRoute";
import { AdminProtectedRoute, AdminLoginRedirect } from "@/components/auth/AdminProtectedRoute";

// Features
import { Landing } from "@/features/landing";
import { PatientLogin, PatientSignup, DoctorLogin, DoctorSignup } from "@/features/auth";
import { PatientDashboard } from "@/features/patient";
import {
  DoctorDashboard,
  DoctorPatientQueue,
  Appointments,
  Reports,
  Analytics,
  Settings as DoctorSettings
} from "@/features/doctor";

// Patient Dashboard Pages
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
} from "@/features/patient/pages";

// Patient Appointment Pages
import MyAppointments from "@/features/patient/pages/MyAppointments";

// Doctor Appointment Pages
import AppointmentRequests from "@/features/doctor/pages/AppointmentRequests";
import ConfirmedAppointments from "@/features/doctor/pages/ConfirmedAppointments";
import AppointmentHistory from "@/features/doctor/pages/AppointmentHistory";

// Patient Onboarding
import { PatientOnboarding, OnboardingComplete } from "@/features/patient/pages/onboarding";

// Doctor Onboarding
import DoctorOnboarding from "@/features/doctor/pages/onboarding/DoctorOnboarding";

// Admin Components
import { AdminLayout } from "@/features/admin/layouts/AdminLayout";
import {
  AdminLogin,
  Dashboard as AdminDashboard,
  Doctors as AdminDoctors,
  DoctorDetails as AdminDoctorDetails,
  Patients as AdminPatients,
  PatientDetails as AdminPatientDetails,
  Appointments as AdminAppointments,
  Revenue as AdminRevenue,
  Settings as AdminSettings,
  PendingDoctors,
} from "@/features/admin";

// Pages
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Layout Routes - with Navbar */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Auth Routes - Public only (redirect to dashboard if logged in) */}
          <Route path="/patient-login" element={
            <PublicRoute restricted>
              <PatientLogin />
            </PublicRoute>
          } />
          <Route path="/patient-signup" element={
            <PublicRoute restricted>
              <PatientSignup />
            </PublicRoute>
          } />
          <Route path="/doctor-login" element={
            <PublicRoute restricted>
              <DoctorLogin />
            </PublicRoute>
          } />
          <Route path="/doctor-signup" element={
            <PublicRoute restricted>
              <DoctorSignup />
            </PublicRoute>
          } />

          {/* Patient Onboarding Routes - Protected */}
          <Route path="/patient-onboarding/*" element={
            <ProtectedRoute>
              <PatientOnboarding />
            </ProtectedRoute>
          } />
          <Route path="/onboarding-complete" element={
            <ProtectedRoute>
              <OnboardingComplete />
            </ProtectedRoute>
          } />

          {/* Doctor Onboarding Route - Protected */}
          <Route path="/doctor-onboarding" element={
            <ProtectedRoute>
              <DoctorOnboarding />
            </ProtectedRoute>
          } />

          {/* patient Dashboard Route  */}
          <Route path="/patient-dashboard" element={
            <ProtectedRoute>
              <PatientDashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="symptom-intake" element={<SymptomIntake />} />
            <Route path="pre-diagnosis" element={<PreDiagnosis />} />
            <Route path="doctor-selection" element={<DoctorSelection />} />
            <Route path="doctors" element={<DoctorSelection />} /> {/* Alias */}
            <Route path="doctor/:id" element={<DoctorProfile />} />
            <Route path="appointment-booking" element={<AppointmentBooking />} />
            <Route path="book-appointment" element={<AppointmentBooking />} /> {/* Alias */}
            <Route path="my-appointments" element={<MyAppointments />} />
            <Route path="live-consultation" element={<LiveConsultation />} />
            <Route path="consultation-summary" element={<ConsultationSummary />} />
            <Route path="medications" element={<Medications />} />
            <Route path="report-upload" element={<ReportUpload />} />
            <Route path="upload-reports" element={<ReportUpload />} /> {/* Alias */}
            <Route path="ai-chatbot" element={<AIChatbot />} />
            <Route path="chatbot" element={<AIChatbot />} /> {/* Alias */}
            <Route path="diet-lifestyle" element={<DietLifestyle />} />
            <Route path="nearby-clinics" element={<NearbyClinics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
            <Route path="logout" element={<Logout />} />
          </Route>

          {/* Doctor Dashboard Route - Legacy */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-dashboard/patients" element={<DoctorPatientQueue />} />
            <Route path="/doctor-dashboard/appointment-requests" element={<AppointmentRequests />} />
            <Route path="/doctor-dashboard/confirmed-appointments" element={<ConfirmedAppointments />} />
            <Route path="/doctor-dashboard/appointment-history" element={<AppointmentHistory />} />
            <Route path="/doctor-dashboard/appointments" element={<Appointments />} />
            <Route path="/doctor-dashboard/reports" element={<Reports />} />
            <Route path="/doctor-dashboard/analytics" element={<Analytics />} />
            <Route path="/doctor-dashboard/settings" element={<DoctorSettings />} />
          </Route>

          {/* Admin Login Route - Hidden, only accessible via URL */}
          <Route path="/admin-login" element={
            <AdminLoginRedirect>
              <AdminLogin />
            </AdminLoginRedirect>
          } />

          {/* Admin Dashboard Routes - Protected */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="doctors/:id" element={<AdminDoctorDetails />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="patients/:id" element={<AdminPatientDetails />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="revenue" element={<AdminRevenue />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="pending-doctors" element={<PendingDoctors />} />
          </Route>

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
