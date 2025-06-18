
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Lock, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthCard from './AuthCard';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignUpPage = () => {
  const { signUpWithEmail, loading } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState('');

  const validatePassword = (password: string): string | undefined => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (generalError) setGeneralError('');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setGeneralError('');

    try {
      const { error } = await signUpWithEmail(formData.email, formData.password);
      
      if (error) {
        if (error.message.includes('already registered') || 
            error.message.includes('already exists')) {
          setGeneralError('Account with this email already exists');
        } else {
          setGeneralError(error.message);
        }
      } else {
        setStep('confirmation');
        toast({
          title: "Check your email",
          description: "We've sent you a verification link. Please check your inbox and click the link to confirm your account.",
        });
      }
    } catch (err) {
      setGeneralError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'confirmation') {
    return (
      <AuthCard 
        title="Check Your Email" 
        description="We've sent you a verification link"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Verification Link Sent</h3>
            <p className="text-gray-300 text-sm">
              We've sent a verification link to<br />
              <span className="text-white font-medium">{formData.email}</span>
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-blue-300 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Click the link in your email to verify your account</span>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-400">
            <p>
              After clicking the verification link, you'll be automatically signed in and redirected to your dashboard.
            </p>
            <p>
              Didn't receive the email?{' '}
              <button 
                onClick={() => setStep('form')}
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Try signing up again
              </button>
            </p>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Create Account" 
      description="Sign up for your PSA Portal account"
    >
      <form onSubmit={handleSignUp} className="space-y-4">
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
              className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 ${
                errors.email ? 'border-red-500' : ''
              }`}
              required
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-xs">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-300">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleInputChange}
              className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 ${
                errors.password ? 'border-red-500' : ''
              }`}
              required
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs">{errors.password}</p>
          )}
          <p className="text-xs text-gray-400">
            Must contain: 8+ chars, uppercase, lowercase, number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 ${
                errors.confirmPassword ? 'border-red-500' : ''
              }`}
              required
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
          )}
        </div>

        {generalError && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg text-sm">
            ⚠️ {generalError}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/" className="text-blue-400 hover:text-blue-300 underline">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          By creating an account, you agree to our Terms of Service
        </p>
      </div>
    </AuthCard>
  );
};

export default SignUpPage;
