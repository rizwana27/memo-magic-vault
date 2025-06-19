
import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import RoleSelector from './RoleSelector';
import LoginSignup from './LoginSignup';

type AuthStep = 'welcome' | 'role-selection' | 'login';
type UserRole = 'admin' | 'vendor' | 'employee';

const AuthFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleGetStarted = () => {
    setCurrentStep('role-selection');
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('login');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setSelectedRole(null);
  };

  const handleBackToRoleSelection = () => {
    setCurrentStep('role-selection');
    setSelectedRole(null);
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
    
    case 'role-selection':
      return <RoleSelector onRoleSelect={handleRoleSelect} onBack={handleBackToWelcome} />;
    
    case 'login':
      return selectedRole ? (
        <LoginSignup role={selectedRole} onBack={handleBackToRoleSelection} />
      ) : null;
    
    default:
      return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }
};

export default AuthFlow;
