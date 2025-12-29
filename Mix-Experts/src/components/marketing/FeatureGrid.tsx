'use client';

import React from 'react';
import { Mic2, DollarSign, Calendar, Globe, BarChart3, Shield } from 'lucide-react';

const FEATURES = [
    {
        icon: Globe,
        title: "Stunning Public Profiles",
        description: "Your own professional website with a custom domain. Showcase your portfolio with our lossless audio player."
    },
    {
        icon: Mic2,
        title: "A/B Audio Player",
        description: "Let clients hear the difference. Seamlessly toggle between before/after versions of your mixes."
    },
    {
        icon: Calendar,
        title: "Automated Booking",
        description: "Stop the email tennis. Clients can book sessions directly on your calendar based on your availability."
    },
    {
        icon: DollarSign,
        title: "Payments & Products",
        description: "Accept payments for services securely. Sell presets, templates, and samples directly to your fans."
    },
    {
        icon: BarChart3,
        title: "Business Analytics",
        description: "Track your growth. See which services are popular and where your revenue is coming from."
    },
    {
        icon: Shield,
        title: "Secure File Transfer",
        description: "Deliver high-quality files securely. Automatically unlock downloads after payment is received."
    }
];

export const FeatureGrid = () => {
    return (
        <section className="py-32 bg-[var(--bg-base)] border-t border-[var(--border-dark)] relative overflow-hidden">

            {/* Simple Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-[var(--accent)] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Everything you need to <br /><span className="text-[var(--accent)]">run your studio</span></h2>
                    <p className="text-lg text-[var(--text-gray)]">
                        Replace your patchwork of tools with one cohesive platform designed specifically for audio professionals.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-dark)] hover:border-[var(--accent-subtle)] transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 rounded-xl bg-[rgba(255,255,255,0.05)] flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:bg-[var(--accent)] transition-all duration-300">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-[var(--text-gray)] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
