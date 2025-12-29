
import React, { useState } from 'react';
import { ViewState } from '../types';
import { Leaf, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onChangeView }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
        // Go to Onboarding for new users
        onChangeView(ViewState.ONBOARDING);
    } else {
        // Go directly home for existing users
        onChangeView(ViewState.HOME);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-sage/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-clay/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl border border-white z-10 animate-fade-up">
        
        {/* Header */}
        <div className="text-center mb-10">
           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center shadow-lg shadow-sage/20 mx-auto mb-6">
              <Leaf size={24} fill="currentColor" />
           </div>
           <h2 className="font-serif text-3xl text-text-primary mb-2">
             {isSignUp ? 'Create your sanctuary' : 'Welcome back'}
           </h2>
           <p className="text-text-secondary font-light">
             {isSignUp ? 'Start your journey to clarity today.' : 'Continue where you left off.'}
           </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                 <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-12 pr-4 text-text-primary focus:ring-2 focus:ring-sage/20 focus:border-sage outline-none transition-all"
                 />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                 <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3.5 pl-12 pr-12 text-text-primary focus:ring-2 focus:ring-sage/20 focus:border-sage outline-none transition-all"
                 />
                 <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-text-secondary"
                 >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                 </button>
              </div>
           </div>

           <button 
              type="submit"
              className="w-full py-4 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2 mt-4 hover:-translate-y-0.5"
           >
              {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} />
           </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-8 text-center">
           <p className="text-sm text-text-secondary">
              {isSignUp ? 'Already have an account?' : 'Don\'t have an account?'}
              <button 
                 onClick={() => setIsSignUp(!isSignUp)}
                 className="ml-2 font-bold text-sage-dark hover:text-sage transition-colors underline decoration-sage/30 underline-offset-4"
              >
                 {isSignUp ? 'Log in' : 'Sign up'}
              </button>
           </p>
        </div>

      </div>
    </div>
  );
};

export default Auth;
