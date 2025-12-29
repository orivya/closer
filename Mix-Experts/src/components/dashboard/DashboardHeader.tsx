import React from 'react';
import { Bell, Search, Plus } from 'lucide-react';
import { DashboardMobileMenu } from './DashboardMobileMenu';

export const DashboardHeader: React.FC = () => {
    return (
        <header className="sticky top-0 z-20 w-full h-[72px] bg-[var(--bg-base)]/80 backdrop-blur-md border-b border-[var(--border-dark)] flex items-center justify-between px-4 md:px-8 transition-all">

            {/* Left: Mobile Menu & Search */}
            <div className="flex items-center gap-4 flex-1">
                <DashboardMobileMenu />

                <div className="relative group w-full max-w-sm hidden md:block">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors">
                        <Search className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search projects, files..."
                        aria-label="Search projects and files"
                        className="w-full pl-9 pr-4 py-2 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-sm text-white placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 md:gap-4">
                <button
                    className="relative p-2 text-[var(--text-muted)] hover:text-white transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
                    aria-label="Notifications"
                    aria-describedby="notification-badge"
                >
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--bg-base)]" aria-hidden="true"></span>
                    <span id="notification-badge" className="sr-only">You have unread notifications</span>
                </button>

                <button
                    className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[var(--accent)] text-white text-sm font-bold rounded-full hover:bg-[var(--accent-light)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_15px_var(--accent-glow)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
                    aria-label="Create new project"
                >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden md:inline">New Project</span>
                    <span className="md:hidden sr-only md:not-sr-only">New</span>
                </button>
            </div>
        </header>
    );
};
