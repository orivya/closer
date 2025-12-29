'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a standard utils file, if not I will replace with clsx or manual string concat

interface TOCProps {
    content: string; // We'll pass the raw markdown content to parse headers
}

interface Header {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents({ content }: TOCProps) {
    const [activeId, setActiveId] = useState<string>('');
    const [headers, setHeaders] = useState<Header[]>([]);

    useEffect(() => {
        // Simple regex to parse H2 and H3 from markdown
        // This is a client-side approximation so we don't need complex AST parsing on the server for now
        const lines = content.split('\n');
        const extractedHeaders: Header[] = [];

        lines.forEach((line) => {
            const match = line.match(/^(#{2,3})\s+(.+)$/);
            if (match) {
                const level = match[1].length;
                const text = match[2];
                // Create a slug from text: "My Header" -> "my-header"
                const id = text
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-');

                extractedHeaders.push({ id, text, level });
            }
        });

        setHeaders(extractedHeaders);
    }, [content]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%' }
        );

        headers.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headers]);

    if (headers.length === 0) return null;

    return (
        <div className="hidden lg:block sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto w-64">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pl-4">On This Page</h3>
            <nav className="flex flex-col gap-1 border-l border-white/10">
                {headers.map((header) => (
                    <a
                        key={header.id}
                        href={`#${header.id}`}
                        className={`
                text-sm py-1.5 pl-4 transition-all duration-300 border-l-2 -ml-[2px]
                ${header.level === 3 ? 'ml-4' : ''}
                ${activeId === header.id
                                ? 'border-[var(--accent)] text-[var(--accent)]'
                                : 'border-transparent text-[var(--text-gray)] hover:text-white hover:border-white/20'}
            `}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(header.id)?.scrollIntoView({ behavior: 'smooth' });
                            setActiveId(header.id);
                        }}
                    >
                        {header.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
