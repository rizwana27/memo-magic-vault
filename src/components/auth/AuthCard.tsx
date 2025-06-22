
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Github, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  selectedRole?: 'admin' | 'vendor' | 'employee';
  onBack?: () => void;
  onAuthSuccess?: () => void;
  onAuthError?: (error: any) => void;
  signInWithEmail?: (email: string, password: string) => Promise<any>;
  signUpWithEmail?: (email: string, password: string) => Promise<any>;
  signInWithMicrosoft?: () => Promise<any>;
  signInWithGoogle?: () => Promise<any>;
  signInWithGitHub?: () => Promise<any>;
  setIsLoading?: (loading: boolean) => void;
}

const AuthCard = ({ 
  title, 
  description, 
  children, 
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
}: AuthCardProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  // If children are provided, render them instead of the default auth form
  if (children) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
            <CardDescription className="text-gray-300">{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      setIsLoading?.(true);
      if (isSignUp && signUpWithEmail) {
        await signUpWithEmail(email, password);
      } else if (signInWithEmail) {
        await signInWithEmail(email, password);
      }
      onAuthSuccess?.();
    } catch (error: any) {
      onAuthError?.(error);
    } finally {
      setIsLoading?.(false);
    }
  };

  const handleSocialAuth = async (provider: 'microsoft' | 'google' | 'github') => {
    try {
      setIsLoading?.(true);
      if (provider === 'microsoft' && signInWithMicrosoft) {
        await signInWithMicrosoft();
      } else if (provider === 'google' && signInWithGoogle) {
        await signInWithGoogle();
      } else if (provider === 'github' && signInWithGitHub) {
        await signInWithGitHub();
      }
      onAuthSuccess?.();
    } catch (error: any) {
      onAuthError?.(error);
    } finally {
      setIsLoading?.(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          {onBack && (
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="absolute top-4 left-4 text-gray-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <CardTitle className="text-2xl font-bold text-white">{title}</CardTitle>
          <CardDescription className="text-gray-300">{description}</CardDescription>
          {selectedRole && (
            <div className="mt-2">
              <span className="text-sm text-blue-400">Role: {selectedRole}</span>
            </div>
          )}
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
                className="bg-white/10 border-white/20 text-white"
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
                className="bg-white/10 border-white/20 text-white"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              onClick={() => handleSocialAuth('microsoft')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Microsoft
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialAuth('google')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Google
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialAuth('github')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-blue-300"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCard;
