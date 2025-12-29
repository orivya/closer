'use client';

import React from 'react';
import { Instagram, Youtube, Twitter } from 'lucide-react';
import Link from 'next/link';
import { ProfileData } from '@/lib/profile-data';

interface FooterProps {
    username?: string;
    profile?: ProfileData;
    displayName?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
    isMarketingPage?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
    username,
    profile,
    displayName: propDisplayName,
    instagramUrl: propInstagramUrl,
    twitterUrl: propTwitterUrl,
    youtubeUrl: propYoutubeUrl,
    isMarketingPage = false
}) => {
    const currentYear = new Date().getFullYear();

    // Use profile data if available, otherwise fall back to props
    const displayName = profile?.display_name || propDisplayName || 'MixExperts';
    const name = isMarketingPage ? 'MixExperts' : displayName;

    // Get social links from profile if available
    const socialLinks = profile?.social_links || {};
    const instagramUrl = socialLinks.instagram || propInstagramUrl;
    const twitterUrl = socialLinks.twitter || propTwitterUrl;
    const youtubeUrl = socialLinks.youtube || propYoutubeUrl;

    return (
        <footer className="border-t border-[var(--border-dark)] py-12 bg-[var(--bg-base)]">
            <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">{name.toUpperCase()}</span>
                    <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
                </div>

                <div className="text-sm text-[var(--text-muted)]">
                    © {currentYear} {name}. All rights reserved.
                </div>

                <div className="flex items-center gap-6">
                    {/* Legal links always visible */}
                    <Link href="/privacy" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">
                        Terms
                    </Link>
                    {isMarketingPage && (
                        <Link href="/blog" className="text-sm font-medium text-[var(--text-gray)] hover:text-white transition-colors">
                            Blog
                        </Link>
                    )}
                    {instagramUrl ? (
                        <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-gray)] hover:text-white transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></Link>
                    ) : !isMarketingPage && (
                        <span className="text-[var(--text-faint)] cursor-not-allowed" aria-label="Instagram (not linked)"><Instagram className="w-5 h-5" /></span>
                    )}
                    {twitterUrl ? (
                        <Link href={twitterUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-gray)] hover:text-white transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></Link>
                    ) : !isMarketingPage && (
                        <span className="text-[var(--text-faint)] cursor-not-allowed" aria-label="Twitter (not linked)"><Twitter className="w-5 h-5" /></span>
                    )}
                    {youtubeUrl ? (
                        <Link href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--text-gray)] hover:text-white transition-colors" aria-label="YouTube"><Youtube className="w-5 h-5" /></Link>
                    ) : !isMarketingPage && (
                        <span className="text-[var(--text-faint)] cursor-not-allowed" aria-label="YouTube (not linked)"><Youtube className="w-5 h-5" /></span>
                    )}
                </div>
            </div>
        </footer>
    );
};
