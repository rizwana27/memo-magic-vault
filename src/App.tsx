
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthCallback from "./components/auth/AuthCallback";
import TopNavLayout from "./components/psa/TopNavLayout";
import Dashboard from "./components/psa/Dashboard";
import Projects from "./components/psa/Projects";
import Clients from "./components/psa/Clients";
import Resources from "./components/psa/Resources";
import Timesheets from "./components/psa/Timesheets";
import Financial from "./components/psa/Financial";
import Reports from "./components/psa/Reports";
import Settings from "./components/psa/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Dashboard />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Projects />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/clients" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Clients />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/team" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Resources />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/time-tracking" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Timesheets />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoices" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Financial />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Reports />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Company</h1>
                    <p>Company management page coming soon...</p>
                  </div>
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <TopNavLayout>
                  <Settings />
                </TopNavLayout>
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
