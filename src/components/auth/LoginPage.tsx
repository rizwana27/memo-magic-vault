
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';

const LoginPage = () => {
  const { signInWithEmail, signInWithMicrosoft, loading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error } = await signInWithEmail(formData.email, formData.password);
      
      if (error) {
        console.error('Login error:', error);
        const errorMessage = 'Email or password incorrect. Please try again.';
        setError(errorMessage);
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been successfully logged in.",
        });
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    
    try {
      toast({
        title: "Redirecting to Microsoft",
        description: "You'll be redirected to Microsoft for authentication with MFA...",
      });
      
      await signInWithMicrosoft(formData.email || undefined);
    } catch (error: any) {
      console.error('Microsoft login error:', error);
      
      let errorMessage = "Microsoft login failed or was cancelled.";
      
      // Handle specific error types
      if (error?.message?.includes('popup_closed_by_user')) {
        errorMessage = "Microsoft login was cancelled. Please try again.";
      } else if (error?.message?.includes('network')) {
        errorMessage = "Network error during Microsoft login. Please check your connection.";
      } else if (error?.message?.includes('oauth')) {
        errorMessage = "Microsoft authentication failed. Please try again or contact support.";
      }
      
      toast({
        title: "Microsoft Login Failed",
        description: `${errorMessage} Try again or use email login.`,
        variant: "destructive",
      });
    } finally {
      setIsMicrosoftLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      description="Sign in to access your PSA dashboard"
    >
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg text-sm">
            ❌ {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
        </div>
      </div>

      <Button
        onClick={handleMicrosoftLogin}
        disabled={loading || isLoading || isMicrosoftLoading}
        variant="outline"
        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        {isMicrosoftLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-3 animate-spin" />
            Redirecting to Microsoft...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-3" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
              <rect x="12" y="1" width="9" height="9" fill="#00a4ef"/>
              <rect x="1" y="12" width="9" height="9" fill="#ffb900"/>
              <rect x="12" y="12" width="9" height="9" fill="#7fba00"/>
            </svg>
            Continue with Microsoft (MFA Required)
          </>
        )}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 hover:text-blue-300 underline">
            Sign up here
          </Link>
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Secure authentication powered by Microsoft Azure AD with MFA
        </p>
      </div>
    </AuthCard>
  );
};

export default LoginPage;
