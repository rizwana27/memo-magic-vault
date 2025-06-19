
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleBasedProtectedRoute from "./components/auth/RoleBasedProtectedRoute";
import RoleBasedRedirect from "./components/auth/RoleBasedRedirect";
import AuthCallback from "./components/auth/AuthCallback";
import SignUpPage from "./components/auth/SignUpPage";
import EmployeeLogin from "./components/auth/EmployeeLogin";
import EmployeeDashboard from "./components/employee/EmployeeDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import ClientDashboard from "./components/dashboards/ClientDashboard";
import VendorDashboard from "./components/dashboards/VendorDashboard";
import Index from "./pages/Index";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login/employee" element={<EmployeeLogin />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            
            {/* Role-based dashboard routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <RoleBasedProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleBasedProtectedRoute>
              } 
            />
            <Route 
              path="/client-dashboard" 
              element={
                <RoleBasedProtectedRoute allowedRoles={['client']}>
                  <ClientDashboard />
                </RoleBasedProtectedRoute>
              } 
            />
            <Route 
              path="/vendor-dashboard" 
              element={
                <RoleBasedProtectedRoute allowedRoles={['vendor']}>
                  <VendorDashboard />
                </RoleBasedProtectedRoute>
              } 
            />
            <Route 
              path="/employee-dashboard" 
              element={
                <RoleBasedProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </RoleBasedProtectedRoute>
              } 
            />
            
            {/* Main PSA portal - admin only */}
            <Route 
              path="/psa" 
              element={
                <RoleBasedProtectedRoute allowedRoles={['admin']}>
                  <Index />
                </RoleBasedProtectedRoute>
              } 
            />
            
            {/* Root route with role-based redirect */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <RoleBasedRedirect />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
