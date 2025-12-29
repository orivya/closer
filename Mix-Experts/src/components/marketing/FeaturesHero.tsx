import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const FeaturesHero = () => {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[var(--accent)]/20 via-[var(--bg-base)] to-transparent opacity-50 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-bold mb-8">
                        <Sparkles className="w-4 h-4" />
                        <span>Everything you need to grow</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                        Built for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-purple-400">Audio Pros</span>,<br />
                        Not Just Web Designers.
                    </h1>

                    <p className="text-xl text-[var(--text-gray)] max-w-2xl mx-auto mb-10 leading-relaxed">
                        MixExperts provides a complete suite of tools designed specifically for the modern audio engineer. From portfolio hosting to seamless payments.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
