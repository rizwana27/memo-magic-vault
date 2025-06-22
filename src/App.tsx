
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthFlow from "./components/auth/AuthFlow";
import AuthCallback from "./components/auth/AuthCallback";
import PSALayout from "./components/psa/PSALayout";
import Dashboard from "./components/psa/Dashboard";
import Projects from "./components/psa/Projects";
import Clients from "./components/psa/Clients";
import Resources from "./components/psa/Resources";
import Timesheets from "./components/psa/Timesheets";
import Financial from "./components/psa/Financial";
import Vendors from "./components/psa/Vendors";
import Reports from "./components/psa/Reports";
import APIDemo from "./components/psa/APIDemo";
import Settings from "./components/psa/Settings";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthFlow />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* PSA Routes */}
              <Route path="/psa" element={
                <ProtectedRoute>
                  <PSALayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="projects" element={<Projects />} />
                <Route path="clients" element={<Clients />} />
                <Route path="resources" element={<Resources />} />
                <Route path="timesheets" element={<Timesheets />} />
                <Route path="financial" element={<Financial />} />
                <Route path="vendors" element={<Vendors />} />
                <Route path="reports" element={<Reports />} />
                <Route path="api-demo" element={<APIDemo />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
