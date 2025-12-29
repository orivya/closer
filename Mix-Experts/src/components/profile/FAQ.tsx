'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQData } from '@/lib/profile-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface FAQProps {
    faqs?: FAQData[];
}

export const FAQ: React.FC<FAQProps> = ({ faqs }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    // Map provided FAQs to display format
    const displayFaqs = (faqs || []).map(faq => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
    }));

    // Show empty state if no FAQs
    if (displayFaqs.length === 0) {
        return (
            <section className="py-24 bg-[var(--bg-elevated)]">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Frequently Asked Questions</h2>
                    <p className="text-[var(--text-gray)] text-lg mb-10">Have questions? Get in touch!</p>
                    <Link href="#contact" className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold rounded-full hover:bg-[var(--accent)] hover:text-white transition-all">
                        Contact Me
                        <HelpCircle className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 bg-[var(--bg-elevated)]">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid md:grid-cols-[1fr_1.2fr] gap-16">
                    <div className="md:sticky md:top-24 h-fit">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Frequently Asked<br />Questions</h2>
                        <p className="text-[var(--text-gray)] text-lg mb-10">Everything you need to know about my products and services.</p>
                        <Link href="#contact" className="inline-flex items-center gap-2 px-6 py-2 bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold rounded-full hover:bg-[var(--accent)] hover:text-white transition-all">
                            Still have questions?
                            <HelpCircle className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {displayFaqs.map((faq, idx) => (
                            <div
                                key={faq.id}
                                className={cn(
                                    "bg-[var(--bg-base)] border rounded-xl transition-all duration-300",
                                    openIndex === idx ? "border-[var(--border-dark-strong)]" : "border-[var(--border-dark)]"
                                )}
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                    aria-expanded={openIndex === idx}
                                >
                                    <span className={cn(
                                        "font-semibold text-lg",
                                        openIndex === idx ? "text-[var(--accent)]" : "text-white"
                                    )}>
                                        {faq.question}
                                    </span>
                                    <ChevronDown className={cn(
                                        "w-5 h-5 text-[var(--text-muted)] transition-transform duration-300",
                                        openIndex === idx ? "rotate-180 text-[var(--accent)]" : ""
                                    )} />
                                </button>
                                <div className={cn(
                                    "overflow-hidden transition-[max-height] duration-300 ease-in-out",
                                    openIndex === idx ? "max-h-[200px]" : "max-h-0"
                                )}>
                                    <div className="p-6 pt-0 text-[var(--text-gray)] leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
