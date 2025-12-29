'use client';

import React, { useState } from 'react';
import { User, Bell, Shield, Camera, Lock, Mail, Smartphone, Globe, Save, CreditCard, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import { VisualsEditor } from '@/components/dashboard/settings/VisualsEditor';
import { ThemeSelector } from '@/components/dashboard/settings/ThemeSelector';
import { ProfileSettingsForm } from '@/components/dashboard/settings/ProfileSettingsForm';
import { BillingSettings } from '@/components/dashboard/settings/BillingSettings';
import Link from 'next/link';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'billing'>('profile');

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-[var(--text-gray)]">Manage your account preferences and security</p>
                </div>
                {/* View Profile Action */}
                <Link
                    href="/jamesmix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] text-white font-medium rounded-xl hover:bg-[var(--bg-card)] hover:border-[var(--accent)] transition-all group"
                >
                    <span>View Public Profile</span>
                    <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                </Link>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="col-span-12 md:col-span-3">
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
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    activeTab === item.id
                                        ? "bg-[var(--accent)] text-white shadow-lg shadow-purple-500/20"
                                        : "text-[var(--text-gray)] hover:bg-[var(--bg-elevated)] hover:text-white"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="col-span-12 md:col-span-9">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-8"
                    >
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-10">

                                {/* Visuals Section */}
                                <VisualsEditor
                                    onUpdate={(type, file) => console.log('Updated', type, file)}
                                />

                                <div className="border-t border-[var(--border-dark)]" />

                                {/* Theme Section */}
                                <ThemeSelector
                                    currentTheme="violet"
                                    onThemeSelect={(theme) => console.log('Selected theme', theme)}
                                />

                                <div className="border-t border-[var(--border-dark)]" />

                                {/* Info Section */}
                                <ProfileSettingsForm />

                                <div className="pt-8 border-t border-[var(--border-dark)] flex items-center justify-between sticky bottom-0 bg-[var(--bg-elevated)]/95 backdrop-blur-sm p-4 -mx-4 -mb-4 rounded-b-2xl border-t z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
                                    <p className="text-sm text-[var(--text-gray)] hidden md:block">
                                        Last saved: Just now
                                    </p>
                                    <button className="flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-all transform hover:scale-105 shadow-[0_0_20px_var(--accent-glow)]">
                                        <Save className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* BILLING TAB */}
                        {activeTab === 'billing' && (
                            <BillingSettings />
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
                                <div className="space-y-6">
                                    {[
                                        { title: 'Project Updates', desc: 'Get notified when a project status changes.', type: 'email' },
                                        { title: 'New Messages', desc: 'Receive emails for new messages in project chats.', type: 'push' },
                                        { title: 'File Uploads', desc: 'Get notified when a client uploads new stems.', type: 'both' },
                                        { title: 'Marketing', desc: 'Receive news about platform updates and tips.', type: 'none' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-4 border-b border-[var(--border-dark)] last:border-0">
                                            <div>
                                                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                                                <p className="text-sm text-[var(--text-gray)]">{item.desc}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button className={cn(
                                                    "w-12 h-6 rounded-full relative transition-colors duration-200",
                                                    item.type !== 'none' ? "bg-[var(--accent)]" : "bg-[var(--bg-card)] border border-[var(--border-dark)]"
                                                )}>
                                                    <div className={cn(
                                                        "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200",
                                                        item.type !== 'none' ? "left-7" : "left-1"
                                                    )} />
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
                                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                                <input type="password" placeholder="••••••••" className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                                <input type="password" className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                                                <input type="password" className="w-full bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-[var(--border-dark)]">
                                        <button className="flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-bold rounded-xl hover:bg-[var(--accent-light)] transition-colors shadow-lg shadow-purple-500/20">
                                            Update Password
                                        </button>
                                    </div>

                                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                        <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                                        <p className="text-sm text-red-200/60 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
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
    );
}
