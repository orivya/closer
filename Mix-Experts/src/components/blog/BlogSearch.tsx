'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export function BlogSearch() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`/blog?${params.toString()}`);
    }, 300);

    return (
        <div className="relative max-w-xl mx-auto mb-10 group">
            <div className="absolute inset-0 bg-[var(--accent)]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-full px-6 py-4 focus-within:border-[var(--accent)] focus-within:bg-white/10 transition-all duration-300">
                <Search className="w-5 h-5 text-[var(--text-gray)] mr-4" />
                <input
                    type="text"
                    placeholder="Search tutorials, plugins, articles..."
                    className="w-full bg-transparent border-none outline-none text-white placeholder-[var(--text-gray)]"
                    onChange={(e) => handleSearch(e.target.value)}
                    defaultValue={searchParams.get('q')?.toString()}
                />
            </div>
        </div>
    );
}
