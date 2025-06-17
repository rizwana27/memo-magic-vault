
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { signInWithMicrosoft, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and App Name */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">PSA Portal</h1>
          <p className="text-gray-400">Professional Services Automation</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to access your PSA dashboard</p>
          </div>

          {/* Microsoft Login Button */}
          <Button
            onClick={signInWithMicrosoft}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <LogIn className="w-5 h-5 mr-3" />
            {loading ? 'Connecting...' : 'Continue with Microsoft'}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secure authentication powered by Microsoft Azure AD
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2024 PSA Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
