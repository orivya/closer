'use client';

import React from 'react';
import { Sliders, Mic2, Music2 } from 'lucide-react';
import Link from 'next/link';
import { ServiceDisplayData } from '@/lib/profile-data';

interface ServicesProps {
    onServiceSelect?: () => void;
    username?: string;
    services?: ServiceDisplayData[];
}

// Map service titles to icons
const getIconForService = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('mix')) return Sliders;
    if (lowerTitle.includes('master')) return Music2;
    if (lowerTitle.includes('vocal') || lowerTitle.includes('track')) return Mic2;
    return Sliders; // default
};

// Internal display service type
interface DisplayService {
    id: string;
    title: string;
    price: string;
    description: string;
    turnaround?: string;
    features: string[];
    slug?: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const Services: React.FC<ServicesProps> = ({ onServiceSelect, username, services }) => {
    // Map provided services to display format
    const displayServices: DisplayService[] = (services || []).map(s => ({
        id: s.id,
        title: s.title,
        price: s.price,
        description: s.description,
        turnaround: s.turnaround,
        features: s.features,
        slug: s.slug,
        icon: getIconForService(s.title),
    }));

    // Show empty state if no services
    if (displayServices.length === 0) {
        return (
            <section id="services" className="py-32 bg-[var(--bg-base)]">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-8">Services</h2>
                    <p className="text-[var(--text-gray)] text-lg">
                        No services available yet. Check back soon!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="services" className="py-32 bg-[var(--bg-base)]">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Select Your<br />Session</h2>
                    </div>
                    <p className="text-[var(--text-gray)] max-w-sm text-lg leading-relaxed">
                        Professional audio engineering packages tailored to your project&apos;s needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {displayServices.map((service) => {
                        const IconComponent = service.icon;
                        return (
                            <div key={service.id} className="group relative bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl p-10 hover:border-[var(--accent)] transition-all duration-500">
                                <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                                    {IconComponent && <IconComponent className="w-12 h-12" />}
                                </div>

                                <div className="h-full flex flex-col">
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                                        <p className="text-[var(--accent)] font-medium text-lg">{service.price}</p>
                                    </div>

                                    <p className="text-[var(--text-gray)] leading-relaxed mb-10">
                                        {service.description}
                                    </p>

                                    <ul className="space-y-4 mb-10 flex-grow">
                                        {service.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-3 text-sm text-[var(--text-gray)]">
                                                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {onServiceSelect ? (
                                        <button
                                            onClick={onServiceSelect}
                                            className="w-full py-4 rounded-xl border border-[var(--border-dark)] text-white font-semibold hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300"
                                        >
                                            Book Session
                                        </button>
                                    ) : (
                                        <Link
                                            href={username ? `/${username}/services/${service.slug || service.id}` : '/checkout'}
                                            className="w-full py-4 rounded-xl border border-[var(--border-dark)] text-white font-semibold hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300 block text-center"
                                        >
                                            Book Session
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
