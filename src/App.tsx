import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import DentistListing from "./pages/DentistListing";
import DentistProfile from "./pages/DentistProfile";
import Treatments from "./pages/Treatments";
import PatientPortal from "./pages/PatientPortal";
import DentistPortal from "./pages/DentistPortal";
import NotFound from "./pages/NotFound";
import AIChatBot from "./components/AIChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dentists" element={<DentistListing />} />
              <Route path="/dentists/:id" element={<DentistProfile />} />
              <Route path="/treatments" element={<Treatments />} />
              <Route path="/patient-portal" element={<PatientPortal />} />
              <Route path="/dentist-portal" element={<DentistPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <AIChatBot />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
