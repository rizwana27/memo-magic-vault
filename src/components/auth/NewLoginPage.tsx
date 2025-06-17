
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Mail, Shield, ArrowRight, Loader2 } from 'lucide-react';

const NewLoginPage = () => {
  const { signInWithMicrosoft, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [isValidating, setIsValidating] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsValidating(true);
    // Simulate email validation
    setTimeout(() => {
      setIsValidating(false);
      setStep('verification');
    }, 1500);
  };

  const handleMicrosoftAuth = async () => {
    try {
      await signInWithMicrosoft();
    } catch (error) {
      console.error('Authentication failed:', error);
      // Reset to email step on error
      setStep('email');
    }
  };

  const resetFlow = () => {
    setStep('email');
    setEmail('');
  };

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
          
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400">Enter your email to get started</p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!email || isValidating}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-5 h-5 ml-3" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {step === 'verification' && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-400" />
                </div>
                <h2 className="text-2xl font-semibold text-white mb-2">Verify Your Identity</h2>
                <p className="text-gray-400 mb-2">We've sent a verification request to:</p>
                <p className="text-blue-400 font-medium">{email}</p>
                <p className="text-sm text-gray-500 mt-4">
                  Please check your Microsoft Authenticator app and approve the sign-in request
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleMicrosoftAuth}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-3" />
                      Complete Authentication
                    </>
                  )}
                </Button>

                <Button
                  onClick={resetFlow}
                  variant="outline"
                  className="w-full bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Use Different Email
                </Button>
              </div>
            </>
          )}

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

export default NewLoginPage;
