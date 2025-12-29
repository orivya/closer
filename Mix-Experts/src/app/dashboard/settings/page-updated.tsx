'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Save, CreditCard, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';
import Link from 'next/link';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { BannerUpload } from '@/components/profile/BannerUpload';
import { BioEditor } from '@/components/profile/BioEditor';
import { TaglineEditor } from '@/components/profile/TaglineEditor';
import { LocationTimezoneSelector } from '@/components/profile/LocationTimezoneSelector';
import { SocialLinksEditor } from '@/components/profile/SocialLinksEditor';
import { ThemeSelectorWithSave } from '@/components/profile/ThemeSelectorWithSave';
import { ProfileCompletenessIndicator } from '@/components/profile/ProfileCompletenessIndicator';
import { PublishToggle } from '@/components/profile/PublishToggle';
import { BillingSettings } from '@/components/dashboard/settings/BillingSettings';
import { useSocialLinks } from '@/hooks/useSocialLinks';
import { usePortfolioItems } from '@/hooks/usePortfolioItems';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>('profile');
  const { profile: authProfile } = useAuth();
  const { profile, loading } = useProfile();
  const { socialLinks } = useSocialLinks();
  const { portfolioItems } = usePortfolioItems();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-[var(--text-gray)]">Manage your account preferences and security</p>
          </div>
          <div className="flex items-center gap-3">
            {profile && <PublishToggle isPublished={profile.is_published} />}
            <Link
              href={`/${authProfile?.username || 'profile'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] text-white font-medium rounded-xl hover:bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all group"
            >
              <span>View Public Profile</span>
              <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-4">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'billing', label: 'Billing & Payouts', icon: CreditCard },
                  { id: 'notifications', label: 'Notifications', icon: Bell },
                  { id: 'security', label: 'Security', icon: Shield },
                ].map((item) => (
                  <button
                    key={item.id}
                    //@ts-ignore
                    onClick={() => setActiveTab(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                      activeTab === item.id
                        ? 'bg-[var(--accent)] text-white shadow-lg shadow-purple-500/20'
                        : 'text-[var(--text-gray)] hover:bg-[var(--bg-elevated)] hover:text-white'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Profile Completeness - only show on profile tab */}
              {activeTab === 'profile' && profile && (
                <ProfileCompletenessIndicator
                  hasAvatar={!!profile.avatar_url}
                  hasBanner={!!profile.banner_url}
                  hasBio={!!profile.bio}
                  hasTagline={!!profile.tagline}
                  hasSocialLinks={socialLinks.length > 0}
                  hasPortfolioItems={portfolioItems.length > 0}
                />
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-12 lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8"
            >
              {/* PROFILE TAB */}
              {activeTab === 'profile' && profile && (
                <div className="space-y-10">
                  {/* Banner and Avatar */}
                  <div className="space-y-8">
                    <BannerUpload currentBannerUrl={profile.banner_url} />
                    <div className="-mt-20 ml-8">
                      <AvatarUpload
                        currentAvatarUrl={profile.avatar_url}
                        displayName={profile.display_name || undefined}
                      />
                    </div>
                  </div>

                  <div className="border-t border-[var(--border-dark)]" />

                  {/* Theme Section */}
                  <ThemeSelectorWithSave currentTheme={profile.theme} />

                  <div className="border-t border-[var(--border-dark)]" />

                  {/* Basic Info */}
                  <div className="space-y-6">
                    <TaglineEditor initialTagline={profile.tagline} />
                    <BioEditor initialBio={profile.bio} />
                    <LocationTimezoneSelector
                      initialLocation={profile.location}
                      initialTimezone={profile.timezone}
                    />
                  </div>

                  <div className="border-t border-[var(--border-dark)]" />

                  {/* Social Links */}
                  <SocialLinksEditor />
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === 'billing' && <BillingSettings />}

              {/* NOTIFICATIONS TAB */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    {[
                      {
                        title: 'Project Updates',
                        desc: 'Get notified when a project status changes.',
                        type: 'email',
                      },
                      {
                        title: 'New Messages',
                        desc: 'Receive emails for new messages in project chats.',
                        type: 'push',
                      },
                      {
                        title: 'File Uploads',
                        desc: 'Get notified when a client uploads new stems.',
                        type: 'both',
                      },
                      {
                        title: 'Marketing',
                        desc: 'Receive news about platform updates and tips.',
                        type: 'none',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-4 border-b border-[var(--border-dark)] last:border-0"
                      >
                        <div>
                          <h3 className="font-bold text-white mb-1">{item.title}</h3>
                          <p className="text-sm text-[var(--text-gray)]">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <button
                            className={cn(
                              'w-12 h-6 rounded-full relative transition-colors duration-200',
                              item.type !== 'none'
                                ? 'bg-[var(--accent)]'
                                : 'bg-[var(--bg-card)] border border-[var(--border-dark)]'
                            )}
                          >
                            <div
                              className={cn(
                                'absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200',
                                item.type !== 'none' ? 'left-7' : 'left-1'
                              )}
                            />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[var(--border-dark)]">
                      <button className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-colors shadow-lg shadow-purple-500/20">
                        Update Password
                      </button>
                    </div>

                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                      <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-200/60 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
