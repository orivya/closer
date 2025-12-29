import React from 'react';

export const metadata = {
    title: 'Engineer Profile | MixExperts',
    description: 'Professional audio engineering portfolio.',
};

import { MobileTabBar } from '@/components/profile/MobileTabBar';
import { fetchProfileByUsername, fetchProfileProducts } from '@/lib/profile-data';

export default async function ProfileLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    // Check if this specific user has products by querying the database
    let hasProducts = false;
    try {
        const profile = await fetchProfileByUsername(username);
        if (profile) {
            const products = await fetchProfileProducts(profile.id);
            hasProducts = products.length > 0;
        }
    } catch {
        // If there's an error, just default to not showing products tab
        hasProducts = false;
    }

    return (
        <div className="relative min-h-screen bg-[var(--bg-base)]">
            {children}
            <MobileTabBar username={username} showShop={hasProducts} />
        </div>
    );
}
