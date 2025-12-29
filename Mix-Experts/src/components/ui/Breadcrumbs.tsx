import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center space-x-2 text-sm text-[var(--text-gray)] mb-8">
            <Link href="/" className="hover:text-white transition-colors">
                <Home className="w-4 h-4" />
            </Link>

            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="w-4 h-4 text-white/20" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-white transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-white font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}
