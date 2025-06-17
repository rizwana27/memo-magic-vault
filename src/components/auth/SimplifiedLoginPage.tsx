
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, Mail, Lock, Eye, EyeOff, Loader2, Moon, Sun, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SimplifiedLoginPage = () => {
  const { signInWithEmail, signUpWithEmail, signInWithMicrosoft, loading } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsAuthenticating(true);
      
      const { error } = isSignUp 
        ? await signUpWithEmail(email, password) 
        : await signInWithEmail(email, password);
      
      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (error.message?.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else if (error.message?.includes('User already registered')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else if (error.message?.includes('Signup requires a valid password')) {
          setError('Please enter a valid password (at least 6 characters).');
        } else {
          setError(error.message || `${isSignUp ? 'Sign up' : 'Sign in'} failed. Please try again.`);
        }
        return;
      }

      if (isSignUp) {
        toast({
          title: "Account Created!",
          description: "Please check your email for a confirmation link to complete your registration.",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error: any) {
      console.error(`${isSignUp ? 'Sign up' : 'Sign in'} error:`, error);
      setError(`${isSignUp ? 'Sign up' : 'Sign in'} failed. Please try again.`);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleMicrosoftAuth = async () => {
    try {
      setError('');
      setIsAuthenticating(true);
      
      toast({
        title: "Redirecting to Microsoft",
        description: "You will be redirected to Microsoft to authenticate.",
      });
      
      await signInWithMicrosoft(email || undefined);
    } catch (error: any) {
      console.error('Microsoft authentication failed:', error);
      setError('Microsoft authentication failed. Please try again.');
      setIsAuthenticating(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    } flex items-center justify-center p-4`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Logo and App Name */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            PSA Portal
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Professional Services Automation
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className={`${
          isDarkMode 
            ? 'bg-gray-800/50 backdrop-blur-sm border-gray-700' 
            : 'bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg'
        } border rounded-xl p-8 transition-all duration-300`}>
          
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isSignUp 
                ? 'Sign up to get started with PSA Portal' 
                : 'Sign in to access your dashboard'
              }
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6 border-red-500/50 bg-red-500/10">
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </Label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  }`}
                  disabled={loading || isAuthenticating}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </Label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${
                    isDarkMode 
                      ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                      : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  }`}
                  disabled={loading || isAuthenticating}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                    isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || isAuthenticating}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {isSignUp && (
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || isAuthenticating}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200"
            >
              {loading || isAuthenticating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              disabled={loading || isAuthenticating}
              className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
            >
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : 'Need an account? Create Account'
              }
            </Button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className={`flex-1 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
            <span className={`px-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>or</span>
            <div className={`flex-1 border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
          </div>

          {/* Microsoft Sign In */}
          <Button
            onClick={handleMicrosoftAuth}
            disabled={loading || isAuthenticating}
            variant="outline"
            className={`w-full ${
              isDarkMode 
                ? 'border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600' 
                : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
            } font-medium py-3 transition-all duration-200`}
          >
            {loading || isAuthenticating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Continue with Microsoft
              </>
            )}
          </Button>

          <div className="mt-6 text-center">
            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center mt-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
          <p>© 2024 PSA Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedLoginPage;
