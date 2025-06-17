
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Shield, Loader2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NewLoginPage = () => {
  const { signInWithMicrosoft, loading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleMicrosoftAuth = async () => {
    try {
      setIsAuthenticating(true);
      console.log('Initiating Microsoft authentication for:', email || 'any account');
      
      toast({
        title: "Redirecting to Microsoft",
        description: "You will be redirected to Microsoft to select your account and authenticate.",
      });
      
      // Pass email as login hint if provided, but don't require it
      await signInWithMicrosoft(email || undefined);
    } catch (error) {
      console.error('Authentication failed:', error);
      toast({
        title: "Authentication Failed",
        description: "There was an error signing in with Microsoft. Please try again.",
        variant: "destructive",
      });
      setIsAuthenticating(false);
    }
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome to PSA Portal</h2>
            <p className="text-gray-400 mb-4">Sign in with your Microsoft account</p>
            <p className="text-sm text-gray-500">
              Supports all Microsoft accounts including Gmail, Outlook, and organizational accounts
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Input - Optional */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address (Optional)
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  disabled={loading || isAuthenticating}
                />
              </div>
              <p className="text-xs text-gray-500">
                Leave empty to choose from available accounts during sign-in
              </p>
            </div>

            {/* Sign In Button */}
            <Button
              onClick={handleMicrosoftAuth}
              disabled={loading || isAuthenticating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading || isAuthenticating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Redirecting to Microsoft...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-3" />
                  Sign in with Microsoft
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy policy
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
