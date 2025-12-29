import React, { useState } from 'react';
import { ViewState } from '../types';
import {
  ChevronLeft, Shield, Key, Smartphone, Eye, EyeOff,
  Lock, Fingerprint, Bell, LogOut, Check, AlertTriangle, UserX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';
import { toast } from '../hooks/use-toast';

interface SettingsSecurityProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const SettingsSecurity: React.FC<SettingsSecurityProps> = ({ onChangeView }) => {
  const { user, signOut } = useAuth();
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  // Security settings state
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Passwords don\'t match',
        description: 'Please make sure your new passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setShowPasswordChange(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({
        title: 'Failed to update password',
        description: err.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    if (!window.confirm('This will sign you out of all devices. Continue?')) return;

    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast({
        title: 'Signed out everywhere',
        description: 'You\'ve been signed out of all devices.',
      });
      window.location.reload();
    } catch (err) {
      toast({
        title: 'Failed to sign out',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="max-w-2xl mx-auto">
        {/* Password Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-subtle flex items-center justify-center border border-sage-border">
              <Key size={20} className="text-sage" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Password</h2>
              <p className="text-xs text-text-muted">Keep your account secure</p>
            </div>
          </div>

          {!showPasswordChange ? (
            <button
              onClick={() => setShowPasswordChange(true)}
              className="w-full p-4 rounded-xl border border-dark-border bg-dark-surface hover:border-sage-border hover:shadow-glow transition-all text-left flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-text-muted" />
                <span className="text-text-secondary">Change password</span>
              </div>
              <ChevronLeft size={18} className="text-text-muted rotate-180" />
            </button>
          ) : (
            <div className="glass-card p-6 rounded-xl space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-dark-border bg-dark-surface focus:ring-2 focus:ring-sage/20 focus:border-sage-border focus:bg-dark-elevated outline-none transition-all text-text-primary placeholder:text-text-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl border border-dark-border bg-dark-surface focus:ring-2 focus:ring-sage/20 focus:border-sage-border focus:bg-dark-elevated outline-none transition-all text-text-primary placeholder:text-text-muted"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowPasswordChange(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-dark-border text-text-secondary hover:bg-dark-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword || !newPassword || !confirmPassword}
                  className="flex-1 px-4 py-3 rounded-xl bg-sage text-white font-medium shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* App Lock Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-subtle flex items-center justify-center border border-sage-border">
              <Fingerprint size={20} className="text-sage" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">App Lock</h2>
              <p className="text-xs text-text-muted">Additional layer of protection</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-dark-border bg-dark-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock size={18} className="text-text-muted" />
                <div>
                  <span className="text-text-secondary">Passcode Lock</span>
                  <p className="text-xs text-text-muted">Require passcode to open app</p>
                </div>
              </div>
              <button
                onClick={() => setPasscodeEnabled(!passcodeEnabled)}
                className={`w-12 h-7 rounded-full transition-all relative ${passcodeEnabled ? 'bg-sage shadow-glow' : 'bg-dark-hover border border-dark-border'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${passcodeEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-dark-border bg-dark-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint size={18} className="text-text-muted" />
                <div>
                  <span className="text-text-secondary">Biometric Unlock</span>
                  <p className="text-xs text-text-muted">Use Face ID or fingerprint</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricEnabled(!biometricEnabled)}
                disabled={!passcodeEnabled}
                className={`w-12 h-7 rounded-full transition-all relative ${biometricEnabled && passcodeEnabled ? 'bg-sage shadow-glow' : 'bg-dark-hover border border-dark-border'} ${!passcodeEnabled ? 'opacity-50' : ''}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${biometricEnabled && passcodeEnabled ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Alerts Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-subtle flex items-center justify-center border border-sage-border">
              <Bell size={20} className="text-sage" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Security Alerts</h2>
              <p className="text-xs text-text-muted">Stay informed about account activity</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-dark-border bg-dark-surface flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="text-text-muted" />
              <div>
                <span className="text-text-secondary">Login Alerts</span>
                <p className="text-xs text-text-muted">Get notified of new sign-ins</p>
              </div>
            </div>
            <button
              onClick={() => setLoginAlerts(!loginAlerts)}
              className={`w-12 h-7 rounded-full transition-all relative ${loginAlerts ? 'bg-sage shadow-glow' : 'bg-dark-hover border border-dark-border'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${loginAlerts ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Sessions Section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-sage-subtle flex items-center justify-center border border-sage-border">
              <Smartphone size={20} className="text-sage" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Active Sessions</h2>
              <p className="text-xs text-text-muted">Manage where you're signed in</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-dark-border bg-dark-surface">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-primary font-medium">Current Session</span>
                <span className="text-xs text-sage bg-sage-subtle px-2 py-1 rounded-full border border-sage-border">Active</span>
              </div>
              <p className="text-sm text-text-muted">
                {navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Browser'}
              </p>
            </div>

            <button
              onClick={handleSignOutAllDevices}
              className="w-full p-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-red-400"
            >
              <LogOut size={18} />
              Sign Out of All Devices
            </button>
          </div>
        </section>

        {/* Privacy Policy Link */}
        <section className="pt-8 border-t border-dark-border mb-10">
          <button
            onClick={() => onChangeView(ViewState.PRIVACY)}
            className="w-full p-4 rounded-xl border border-dark-border bg-dark-surface hover:border-sage-border hover:shadow-glow transition-all text-left flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Shield size={18} className="text-text-muted" />
              <span className="text-text-secondary">View Privacy Policy</span>
            </div>
            <ChevronLeft size={18} className="text-text-muted rotate-180" />
          </button>
        </section>

        {/* Delete Account Section - Moved from main Settings */}
        <section className="pt-8 border-t border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <UserX size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="font-medium text-text-primary">Delete Account</h2>
              <p className="text-xs text-text-muted">Permanently remove your account and all data</p>
            </div>
          </div>

          <button
            onClick={async () => {
              if (!window.confirm("Are you sure you want to delete your account? This action is IRREVERSIBLE and will delete all your journal entries, voice memos, and data.")) return;

              try {
                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) throw new Error('Failed to delete account');

                toast({
                  title: 'Account deleted',
                  description: 'Your account has been permanently deleted.',
                });

                await signOut();
                onChangeView(ViewState.HOME);
              } catch (err: any) {
                toast({
                  title: 'Failed to delete account',
                  description: err.message || 'Please try again.',
                  variant: 'destructive',
                });
              }
            }}
            className="w-full p-4 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 font-medium"
          >
            Delete My Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsSecurity;
