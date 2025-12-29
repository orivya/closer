'use client';

import { Twitter, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareProps {
    title: string;
    slug: string;
}

export function ShareButtons({ title, slug }: ShareProps) {
    const [copied, setCopied] = useState(false);
    const url = `https://mix-experts.com/blog/${slug}`; // In prod use env var

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-4 mb-8">
            <span className="text-sm font-bold text-[var(--text-gray)] uppercase tracking-wider">Share</span>

            <button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank')}
                className="p-2 rounded-full bg-white/5 hover:bg-[#1DA1F2]/20 hover:text-[#1DA1F2] transition-all"
                aria-label="Share on Twitter"
            >
                <Twitter className="w-4 h-4" />
            </button>

            <button
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')}
                className="p-2 rounded-full bg-white/5 hover:bg-[#4267B2]/20 hover:text-[#4267B2] transition-all"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
            </button>

            <button
                onClick={copyToClipboard}
                className="p-2 rounded-full bg-white/5 hover:bg-[var(--accent)]/20 hover:text-[var(--accent)] transition-all relative"
                aria-label="Copy Link"
            >
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
            </button>
        </div>
    );
}
