import React from 'react';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SessionTimeoutWarning } from '@/components/auth/SessionTimeoutWarning';
import { createClient } from '@/lib/supabase-server';

export const metadata = {
    title: 'Dashboard — MixExperts',
    description: 'Manage your studio.',
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side authentication check
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    // Redirect to login if not authenticated
    if (error || !user) {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-[var(--bg-base)] overflow-hidden">
            {/* Session Timeout Warning */}
            <SessionTimeoutWarning />

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
            >
                Skip to main content
            </a>
            {/* Persistent Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />

                <main id="main-content" className="flex-1 overflow-y-auto overflow-x-hidden p-8 scroll-smooth">
                    <div className="max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
