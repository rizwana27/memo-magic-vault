
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Crown, Building, User } from 'lucide-react';

interface AuthCardProps {
  selectedRole: 'admin' | 'vendor' | 'employee';
  onBack: () => void;
  onAuthSuccess: () => void;
  onAuthError: (error: any) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>;
  signUpWithEmail: (email: string, password: string, role?: string) => Promise<{ error?: any }>;
  signInWithMicrosoft: (email?: string, role?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
}

const AuthCard: React.FC<AuthCardProps> = ({
  selectedRole,
  onBack,
  onAuthSuccess,
  onAuthError,
  signInWithEmail,
  signUpWithEmail,
  signInWithMicrosoft,
  signInWithGoogle,
  signInWithGitHub,
  setIsLoading
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const roleIcons = {
    admin: Crown,
    vendor: Building,
    employee: User
  };

  const roleLabels = {
    admin: 'Admin',
    vendor: 'Vendor',
    employee: 'Employee'
  };

  const RoleIcon = roleIcons[selectedRole];

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUpWithEmail(email, password, selectedRole);
      } else {
        result = await signInWithEmail(email, password);
      }

      if (result?.error) {
        onAuthError(result.error);
      } else {
        onAuthSuccess();
      }
    } catch (error: any) {
      onAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'microsoft' | 'google' | 'github') => {
    try {
      setIsLoading(true);
      
      if (provider === 'microsoft') {
        await signInWithMicrosoft(email, selectedRole);
      } else if (provider === 'google') {
        await signInWithGoogle();
      } else if (provider === 'github') {
        await signInWithGitHub();
      }
      
      // OAuth redirects handle the navigation automatically
    } catch (error: any) {
      onAuthError(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardHeader className="text-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-4 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isSignUp ? `Sign up as ${roleLabels[selectedRole]}` : `Sign in as ${roleLabels[selectedRole]}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isSignUp ? "Create Account" : "Sign In"}
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

          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('microsoft')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Microsoft
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('google')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn('github')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              GitHub
            </Button>
          </div>
          
          <Button
            onClick={() => setIsSignUp(!isSignUp)}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCard;
