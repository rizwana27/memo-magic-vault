
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import RoleSelector from './RoleSelector';
import AuthCard from './AuthCard';

type AuthStep = 'welcome' | 'role-selection' | 'auth';

const AuthFlow = () => {
  const { signInWithEmail, signUpWithEmail, signInWithMicrosoft, signInWithGoogle, signInWithGitHub, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<AuthStep>('welcome');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'vendor' | 'employee' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    setCurrentStep('role-selection');
  };

  const handleRoleSelect = (role: 'admin' | 'vendor' | 'employee') => {
    setSelectedRole(role);
    setCurrentStep('auth');
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('role-selection');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setSelectedRole(null);
  };

  const handleAuthSuccess = () => {
    navigate('/');
    toast({
      title: "Welcome!",
      description: "You have been successfully signed in.",
    });
  };

  const handleAuthError = (error: any) => {
    toast({
      title: "Authentication Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (currentStep === 'welcome') {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  if (currentStep === 'role-selection') {
    return (
      <RoleSelector 
        onRoleSelect={handleRoleSelect}
        onBack={handleBackToWelcome}
      />
    );
  }

  if (currentStep === 'auth' && selectedRole) {
    return (
      <AuthCard
        title={`${selectedRole === 'admin' ? 'Admin' : selectedRole === 'vendor' ? 'Vendor' : 'Employee'} Sign In`}
        description={`Access your ${selectedRole} dashboard and tools`}
        selectedRole={selectedRole}
        onBack={handleBackToRoleSelection}
        onAuthSuccess={handleAuthSuccess}
        onAuthError={handleAuthError}
        signInWithEmail={signInWithEmail}
        signUpWithEmail={signUpWithEmail}
        signInWithMicrosoft={signInWithMicrosoft}
        signInWithGoogle={signInWithGoogle}
        signInWithGitHub={signInWithGitHub}
        setIsLoading={setIsLoading}
      />
    );
  }

  return null;
};

export default AuthFlow;
