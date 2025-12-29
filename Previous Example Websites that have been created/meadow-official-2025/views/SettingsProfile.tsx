import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { ChevronLeft, User, Mail, Camera, Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../src/integrations/supabase/client';
import { toast } from '../hooks/use-toast';

interface SettingsProfileProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

const SettingsProfile: React.FC<SettingsProfileProps> = ({ onChangeView }) => {
  const { user, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  useEffect(() => {
    const originalName = profile?.display_name || '';
    const originalBio = profile?.bio || '';
    setHasChanges(displayName !== originalName || bio !== originalBio);
  }, [displayName, bio, profile]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          bio: bio.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
      setHasChanges(false);
    } catch (err) {
      toast({
        title: 'Failed to save',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const initials = displayName
    ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="animate-fade-up">
      {/* Save Button - Fixed position */}
      {hasChanges && (
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-sage text-white rounded-full font-medium shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Save
          </button>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Avatar Section */}
        <section className="mb-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sage-400 to-sage-600 flex items-center justify-center text-white font-serif text-2xl shadow-xl border-4 border-white">
                {initials}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full border border-sage-200/60 flex items-center justify-center hover:border-sage-300 hover:shadow-sm transition-all">
                <Camera size={14} className="text-sage-600" />
              </button>
            </div>
            <div>
              <h2 className="font-medium text-text-primary">{displayName || 'Your Name'}</h2>
              <p className="text-sm text-text-muted">{user?.email}</p>
              <button className="mt-2 text-sm text-sage hover:text-sage-light transition-colors">
                Change photo
              </button>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <section className="space-y-6">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Display Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-sage-400/10 focus:border-sage-400 outline-none transition-all text-text-primary placeholder:text-text-muted"
              />
            </div>
            <p className="mt-2 text-xs text-text-muted">
              This is how you'll appear in the app
            </p>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white/40 backdrop-blur-sm text-text-muted cursor-not-allowed"
              />
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Contact support to change your email address
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A few words about yourself..."
              rows={4}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:ring-4 focus:ring-sage-400/10 focus:border-sage-400 outline-none transition-all text-text-primary placeholder:text-text-muted resize-none"
            />
            <p className="mt-2 text-xs text-text-muted">
              Optional: Add a short bio for your profile
            </p>
          </div>
        </section>

        {/* Account Info */}
        <section className="mt-12 pt-8 border-t border-stone-200/70">
          <h3 className="font-serif text-lg text-text-primary mb-4">Account Information</h3>
          <div className="glass-card rounded-xl p-4 space-y-0">
            <div className="flex justify-between py-3 border-b border-stone-200/70">
              <span className="text-text-muted">Account created</span>
              <span className="text-text-secondary">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-text-muted">Last sign in</span>
              <span className="text-text-secondary">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsProfile;
