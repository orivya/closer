import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { Leaf, ArrowRight, Mail, Lock, Eye, EyeOff, User, Loader2, X } from 'lucide-react';
import { supabase } from '../src/integrations/supabase/client';
import { z } from 'zod';

interface AuthProps {
  onChangeView: (view: ViewState, data?: any) => void;
  onClose?: () => void;
}

// Validation schemas
const emailSchema = z.string().trim().email({ message: "Please enter a valid email address" });
const passwordSchema = z.string().min(6, { message: "Password must be at least 6 characters" });
const displayNameSchema = z.string().trim().min(1, { message: "Please enter your name" }).max(50, { message: "Name must be less than 50 characters" });

const Auth: React.FC<AuthProps> = ({ onChangeView, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onChangeView(ViewState.HOME);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (event === 'SIGNED_IN') {
          // Check if new user (just signed up) vs returning user
          const isNewUser = session.user.created_at === session.user.updated_at;
          if (isNewUser) {
            onChangeView(ViewState.ONBOARDING, { userName: displayName });
          } else {
            onChangeView(ViewState.HOME);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [onChangeView, displayName]);

  const validateForm = (): boolean => {
    setError(null);

    try {
      emailSchema.parse(email);
      if (!isForgotPassword) {
        passwordSchema.parse(password);
        if (isSignUp) {
          displayNameSchema.parse(displayName);
        }
      }
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0].message);
      }
      return false;
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings?reset=true`, // Redirect to settings to change password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage("Check your email for a password reset link.");
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Use current origin for email confirmation redirect
        const redirectUrl = window.location.origin;

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName.trim()
            }
          }
        });

        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('This email is already registered. Please sign in instead.');
          } else {
            setError(signUpError.message);
          }
          return;
        }

        // Check if email confirmation is required
        if (signUpData?.user && !signUpData?.session) {
          const userEmail = email.trim();
          setPendingEmail(userEmail);
          setSuccessMessage(`Please check your email (${userEmail}) to confirm your account. Click the link in the email to complete signup.`);
          setEmail('');
          setPassword('');
          setDisplayName('');
          // Switch to sign in mode after showing message
          setTimeout(() => {
            setIsSignUp(false);
            setSuccessMessage(null);
          }, 10000); // Increased to 10 seconds to allow resend
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password
        });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.');
          } else {
            setError(signInError.message);
          }
          return;
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!pendingEmail) return;
    
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setSuccessMessage(`Confirmation email resent to ${pendingEmail}. Please check your inbox (and spam folder).`);
      }
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-base flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* Exit Button - Navigate back to landing page */}
      <button
        onClick={() => {
          if (onClose) {
            onClose();
          } else {
            // Fallback: navigate to landing page
            window.history.pushState({}, '', '/');
            window.location.reload();
          }
        }}
        className="absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center text-text-muted hover:text-text-secondary hover:bg-dark-surface border border-dark-border transition-all z-20"
        aria-label="Go back to home"
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-sage/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-sage/[0.02] rounded-full blur-[100px]" />

      <div className="w-full max-w-md glass-card-elevated p-8 md:p-12 rounded-[40px] z-10 animate-fade-up">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-sage text-white flex items-center justify-center shadow-glow mx-auto mb-6">
            <Leaf size={24} fill="currentColor" />
          </div>
          <h2 className="font-serif text-3xl text-text-primary mb-2">
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create your sanctuary' : 'Welcome back'}
          </h2>
          <p className="text-text-secondary font-light">
            {isForgotPassword ? 'Enter your email to receive valid instructions.' : isSignUp ? 'Start your journey to clarity today.' : 'Continue where you left off.'}
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm animate-fade-in">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-sage-subtle border border-sage-border rounded-xl text-sage text-sm animate-fade-in">
            <div className="flex flex-col gap-2">
              <p>{successMessage}</p>
              {pendingEmail && (
                <button
                  onClick={handleResendConfirmation}
                  disabled={isLoading}
                  className="text-left text-sage hover:text-sage-light underline text-xs font-medium self-start mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Resend confirmation email'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={isForgotPassword ? handleResetPassword : handleSubmit} className="space-y-5">
          {isSignUp && !isForgotPassword && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-sage/20 focus:border-sage-border focus:bg-dark-elevated outline-none transition-all placeholder:text-text-muted"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-dark-surface border border-dark-border rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-sage/20 focus:border-sage-border focus:bg-dark-elevated outline-none transition-all placeholder:text-text-muted"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                      setSuccessMessage(null);
                    }}
                    className="text-xs text-sage hover:text-sage-light transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-dark-surface border border-dark-border rounded-xl py-3.5 pl-12 pr-12 text-text-primary focus:ring-2 focus:ring-sage/20 focus:border-sage-border focus:bg-dark-elevated outline-none transition-all placeholder:text-text-muted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-text-muted ml-1">At least 6 characters</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-sage text-white rounded-xl font-medium shadow-glow hover:shadow-glow-lg transition-all flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center">
          {isForgotPassword ? (
            <button
              onClick={() => {
                setIsForgotPassword(false);
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Back to Sign In
            </button>
          ) : (
            <p className="text-sm text-text-secondary">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="ml-2 font-bold text-sage hover:text-sage-light transition-colors underline decoration-sage/30 underline-offset-4"
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Auth;