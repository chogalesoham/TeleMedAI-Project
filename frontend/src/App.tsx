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

// Patient Dashboard Pages - All 19 pages
import {
  DashboardHome,
  SymptomIntake,
  PreDiagnosis,
  DoctorSelection,
  AppointmentBooking,
  WaitingRoom,
  LiveConsultation,
  ConsultationSummary,
  Medications,
  ReportUpload,
  MedicalHistory,
  AIChatbot,
  DietLifestyle,
  NearbyClinics,
  SpecialistRecommendation,
  Profile,
  Settings,
  Support,
  Logout,
} from "@/features/patient/pages";

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

          {/* patient Dashboard Route  */}
          <Route path="/patient-dashboard" element={
            // <ProtectedRoute>
              <PatientDashboardLayout />
            // </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="symptom-intake" element={<SymptomIntake />} />
            <Route path="pre-diagnosis" element={<PreDiagnosis />} />
            <Route path="doctor-selection" element={<DoctorSelection />} />
            <Route path="doctors" element={<DoctorSelection />} /> {/* Alias */}
            <Route path="appointment-booking" element={<AppointmentBooking />} />
            <Route path="book-appointment" element={<AppointmentBooking />} /> {/* Alias */}
            <Route path="waiting-room" element={<WaitingRoom />} />
            <Route path="live-consultation" element={<LiveConsultation />} />
            <Route path="consultation-summary" element={<ConsultationSummary />} />
            <Route path="medications" element={<Medications />} />
            <Route path="report-upload" element={<ReportUpload />} />
            <Route path="upload-reports" element={<ReportUpload />} /> {/* Alias */}
            <Route path="medical-history" element={<MedicalHistory />} />
            <Route path="ai-chatbot" element={<AIChatbot />} />
            <Route path="chatbot" element={<AIChatbot />} /> {/* Alias */}
            <Route path="diet-lifestyle" element={<DietLifestyle />} />
            <Route path="nearby-clinics" element={<NearbyClinics />} />
            <Route path="specialist-recommendation" element={<SpecialistRecommendation />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="support" element={<Support />} />
            <Route path="logout" element={<Logout />} />
          </Route>

          {/* Doctor Dashboard Route - Legacy */}
          <Route element={
            // <ProtectedRoute>
              <DashboardLayout />
            // </ProtectedRoute>
          }>
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-dashboard/patients" element={<DoctorPatientQueue />} />
            <Route path="/doctor-dashboard/appointments" element={<Appointments />} />
            <Route path="/doctor-dashboard/reports" element={<Reports />} />
            <Route path="/doctor-dashboard/analytics" element={<Analytics />} />
            <Route path="/doctor-dashboard/settings" element={<DoctorSettings />} />
          </Route>

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
