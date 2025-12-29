'use client';

import React, { useEffect, useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { Check, ArrowRight, Loader2, Sliders, Mic2, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Service {
    id: string;
    name: string;
    slug: string;
    description: string;
    base_price: number;
    turnaround_days: number;
    revision_count: number;
    features: string[];
    is_active: boolean;
}

const getServiceIcon = (slug: string) => {
    if (slug.includes('full') || slug.includes('mix')) return Sliders;
    if (slug.includes('vocal') || slug.includes('2-track')) return Mic2;
    if (slug.includes('master')) return Music2;
    return Sliders;
};

export const Step1ServiceSelection = () => {
    const { selectService, data } = useBooking();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await fetch('/api/services/public');
                if (!response.ok) {
                    throw new Error('Failed to fetch services');
                }
                const data = await response.json();
                setServices(data.services || []);
            } catch (err) {
                console.error('Error fetching services:', err);
                setError(err instanceof Error ? err.message : 'Failed to load services');
            } finally {
                setLoading(false);
            }
        }

        fetchServices();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin" />
            </div>
        );
    }

    if (error || services.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-[var(--text-muted)] mb-4">
                    {error || 'No services available at this time.'}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Select a Service</h2>
                <p className="text-[var(--text-gray)]">Choose the package that fits your project needs.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {services.map((service, index) => {
                    const Icon = getServiceIcon(service.slug);
                    const isPopular = index === 0; // First service is popular

                    return (
                        <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl p-6 hover:border-[var(--accent)] transition-all cursor-pointer flex flex-col"
                            onClick={() => selectService({
                                id: service.id,
                                title: service.name,
                                price: `$${service.base_price}`,
                                description: service.description,
                                turnaround: `${service.turnaround_days} Days`,
                                features: service.features,
                                icon: Icon
                            })}
                        >
                            {isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <Icon className="w-10 h-10 text-[var(--accent)] mb-4 p-2 bg-[var(--bg-card)] rounded-xl" />
                                <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-medium text-[var(--text-muted)]">Starting at</span>
                                    <span className="text-2xl font-bold text-white">${service.base_price}</span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8 flex-1">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-gray)]">
                                        <Check className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className="w-full py-3 bg-[var(--bg-card)] text-white font-bold rounded-xl group-hover:bg-[var(--accent)] transition-colors flex items-center justify-center gap-2">
                                Select Package
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};
