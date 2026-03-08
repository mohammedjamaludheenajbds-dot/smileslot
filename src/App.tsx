import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import DentistListing from "./pages/DentistListing";
import DentistProfile from "./pages/DentistProfile";
import Treatments from "./pages/Treatments";
import PatientPortal from "./pages/PatientPortal";
import DentistPortal from "./pages/DentistPortal";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import AdminPayments from "./pages/AdminPayments";
import AIChatBot from "./components/AIChatBot";
import PaymentGate, { isPaymentVerified } from "./components/PaymentGate";
import { useAuthStore } from "./stores/authStore";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: "patient" | "doctor" }) => {
  const { isLoggedIn, role } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppContent = () => {
  const [paid, setPaid] = useState(isPaymentVerified());

  if (!paid) {
    return <PaymentGate onVerified={() => setPaid(true)} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dentists" element={<DentistListing />} />
          <Route path="/dentists/:id" element={<DentistProfile />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/patient-portal" element={
            <ProtectedRoute allowedRole="patient"><PatientPortal /></ProtectedRoute>
          } />
          <Route path="/dentist-portal" element={
            <ProtectedRoute allowedRole="doctor"><DentistPortal /></ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <AIChatBot />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
