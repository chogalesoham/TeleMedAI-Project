import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Layouts
import { MainLayout, DashboardLayout } from "@/layouts";

// Features
import { Landing } from "@/features/landing";
import { PatientLogin, PatientSignup, DoctorLogin, DoctorSignup } from "@/features/auth";
import { PatientDashboard } from "@/features/patient";
import { DoctorDashboard, DoctorPatientQueue } from "@/features/doctor";

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

          {/* Auth Routes - Clean layout */}
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient-signup" element={<PatientSignup />} />
          <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />

          {/* Dashboard Routes - with Dashboard layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor-dashboard/patients" element={<DoctorPatientQueue />} />
          </Route>

          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
