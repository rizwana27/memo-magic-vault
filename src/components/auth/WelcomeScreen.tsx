
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Users, Building2 } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo and Header */}
        <div className="space-y-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
            Welcome to PSA
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Professional Services Automation Platform
          </p>
          
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Streamline your business operations with our comprehensive platform designed for admins, vendors, and employees.
          </p>
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <Shield className="h-8 w-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Secure Access</h3>
            <p className="text-gray-400 text-sm">Role-based authentication with enterprise-grade security</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <Users className="h-8 w-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Team Management</h3>
            <p className="text-gray-400 text-sm">Collaborate seamlessly across your organization</p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-all duration-300">
            <Building2 className="h-8 w-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Project Control</h3>
            <p className="text-gray-400 text-sm">Complete visibility and control over your projects</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-6">
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 text-lg"
          >
            Let's Get Started!
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-gray-500">
            Choose your role and access your personalized dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
