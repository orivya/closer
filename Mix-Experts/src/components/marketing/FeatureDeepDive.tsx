import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FeatureDeepDiveProps {
    title: string;
    description: string;
    benefits: string[];
    imagePath?: string; // In a real app this would be required, optional here for mocking
    align?: 'left' | 'right';
    badge: string;
}

export const FeatureDeepDive = ({ title, description, benefits, badge, align = 'left' }: FeatureDeepDiveProps) => {
    return (
        <section className="py-24 relative">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className={cn(
                    "flex flex-col gap-16 items-center",
                    align === 'right' ? "md:flex-row-reverse" : "md:flex-row"
                )}>
                    {/* Text Content */}
                    <div className="flex-1">
                        <div className="inline-block px-3 py-1 bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-lg text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-6">
                            {badge}
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">{title}</h2>
                        <p className="text-lg text-[var(--text-gray)] mb-8 leading-relaxed">
                            {description}
                        </p>

                        <div className="space-y-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] shrink-0">
                                        <Check className="w-3 h-3 stroke-[3px]" />
                                    </div>
                                    <span className="text-white font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Content (Mocked Placeholder) */}
                    <div className="flex-1 w-full">
                        <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border-dark)] bg-[var(--bg-elevated)] group">
                            {/* Decorative Elements simulating UI */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-base)] opacity-50" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[var(--text-muted)] font-mono text-sm opacity-50">
                                    Feature Visualization: {title}
                                </span>
                            </div>

                            {/* Hover GLOW effect */}
                            <div className="absolute inset-0 bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
