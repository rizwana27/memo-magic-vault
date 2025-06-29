
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Loader2, Shield, Crown, Building, User, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LoginSignupProps {
  role: 'admin' | 'vendor' | 'employee';
  onBack: () => void;
}

const LoginSignup: React.FC<LoginSignupProps> = ({ role, onBack }) => {
  const { signInWithMicrosoft, signUpWithEmail, signInWithEmail, loading } = useAuth();
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfig = {
    admin: {
      title: 'Admin Portal',
      icon: Crown,
      color: 'from-red-500 to-pink-600',
      description: 'Access the full administrative dashboard'
    },
    vendor: {
      title: 'Vendor Portal',
      icon: Building,
      color: 'from-blue-500 to-cyan-600',
      description: 'Manage vendor operations and contracts'
    },
    employee: {
      title: 'Employee Portal',
      icon: User,
      color: 'from-green-500 to-emerald-600',
      description: 'Track time and manage your tasks'
    }
  };

  const config = roleConfig[role];

  const validateUserRole = async (userId: string): Promise<boolean> => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_role, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return false;
      }

      const userRole = profile?.user_role || profile?.role || 'user';
      console.log('User role from DB:', userRole, 'Expected role:', role);

      // Check if user's role matches the selected portal
      if (userRole === role) {
        return true;
      }

      // Special case: 'user' role should be treated as 'employee'
      if (role === 'employee' && userRole === 'user') {
        return true;
      }

      return false;
    } catch (error) {
      console.error('Role validation error:', error);
      return false;
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let result;
      if (isSignUp) {
        // Include role in user metadata for signup
        result = await signUpWithEmail(email, password, role);
        
        if (result.error) {
          toast({
            title: "Sign Up Failed",
            description: result.error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Check Your Email",
            description: "We've sent you a verification link to complete your registration.",
          });
        }
      } else {
        // Sign in and validate role
        result = await signInWithEmail(email, password);
        
        if (result.error) {
          toast({
            title: "Sign In Failed",
            description: result.error.message,
            variant: "destructive",
          });
        } else {
          // Get the current user after successful login
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // Validate user's role matches the selected portal
            const isAuthorized = await validateUserRole(user.id);
            
            if (!isAuthorized) {
              // Sign out the user and show error
              await supabase.auth.signOut();
              
              toast({
                title: "Access Denied",
                description: `You are not authorized to access the ${config.title}. Please select the correct role portal.`,
                variant: "destructive",
              });
              
              // Navigate back to role selection after a delay
              setTimeout(() => {
                onBack();
              }, 2000);
              
              return;
            }
            
            // Role matches, user will be redirected by auth state change
            toast({
              title: "Welcome!",
              description: `Successfully signed in to ${config.title}`,
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Authentication Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMicrosoftAuth = async () => {
    try {
      toast({
        title: "Redirecting to Microsoft",
        description: "You'll be redirected to Microsoft for authentication...",
      });
      await signInWithMicrosoft(email || undefined, role);
    } catch (error: any) {
      toast({
        title: "Microsoft Authentication Failed",
        description: error.message || "Please try again or use email authentication.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Role Selection
          </button>

          <div className="flex items-center justify-center mb-4">
            <div className={`bg-gradient-to-r ${config.color} p-3 rounded-xl shadow-lg`}>
              <config.icon className="h-8 w-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
          <p className="text-gray-400">{config.description}</p>
        </div>

        {/* Auth Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
            </p>
          </div>

          {/* Role Access Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2 text-yellow-300 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Only users with {role} role can access this portal</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || loading}
              className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white font-medium py-3 transition-all duration-200`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleMicrosoftAuth}
            disabled={loading || isSubmitting}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 21 21">
                  <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                  <rect x="12" y="1" width="9" height="9" fill="#00a4ef"/>
                  <rect x="1" y="12" width="9" height="9" fill="#ffb900"/>
                  <rect x="12" y="12" width="9" height="9" fill="#7fba00"/>
                </svg>
                Continue with Microsoft
              </>
            )}
          </Button>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
