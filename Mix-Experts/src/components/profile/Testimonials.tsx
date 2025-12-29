'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { TestimonialData } from '@/lib/profile-data';

interface TestimonialsProps {
    testimonials?: TestimonialData[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials }) => {
    // Map provided testimonials to display format
    const displayTestimonials = (testimonials || []).map(t => ({
        id: t.id,
        text: t.text,
        author: t.author_name,
        project: t.project_name,
        image: t.author_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
        rating: t.rating,
    }));

    // Show empty state if no testimonials
    if (displayTestimonials.length === 0) {
        return (
            <section className="py-32 bg-[var(--bg-base)]">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">Artist Stories</h2>
                    <p className="text-[var(--text-gray)]">No reviews yet. Be the first to share your experience!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-32 bg-[var(--bg-base)]">
            <div className="max-w-[1400px] mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16 text-center">Artist Stories</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {displayTestimonials.map((t) => {
                        const rating = 'rating' in t ? t.rating : 5;
                        return (
                            <div key={t.id} className="bg-[var(--bg-card)] border border-[var(--border-dark)] p-8 rounded-3xl relative overflow-hidden group hover:bg-[var(--bg-elevated)] transition-colors duration-300">
                                <div className="flex gap-1 mb-6 text-[var(--accent)] opacity-80">
                                    {[...Array(rating)].map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                    ))}
                                </div>
                                <p className="text-[var(--text-gray)] leading-relaxed mb-8 text-lg font-light">&quot;{t.text}&quot;</p>
                                <div className="flex items-center gap-4">
                                    <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                    <div>
                                        <div className="text-sm font-bold text-white">{t.author}</div>
                                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t.project}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
