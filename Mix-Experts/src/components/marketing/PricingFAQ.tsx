'use client';

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
    {
        question: "Is there a free trial?",
        answer: "Yes! Every new account gets a 14-day free trial of the Pro plan. No credit card required to sign up."
    },
    {
        question: "Can I use my own domain?",
        answer: "Absolutely. On the Pro and Studio plans, you can connect any custom domain (e.g., yourname.com) directly to your profile."
    },
    {
        question: "What are the transaction fees?",
        answer: "The Starter plan has a 5% transaction fee on all payments. The Pro and Studio plans have 0% transaction fees (standard Stripe processing fees still apply)."
    },
    {
        question: "Can I cancel anytime?",
        answer: "Yes, there are no long-term contracts. You can cancel or downgrade your subscription at any time from your dashboard."
    }
];

export const PricingFAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-[var(--bg-base)] border-t border-[var(--border-dark)]">
            <div className="max-w-3xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-white text-center mb-16">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className="bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--accent-subtle)]"
                        >
                            <button
                                className="w-full px-6 py-4 flex items-center justify-between text-left"
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                            >
                                <span className="text-lg font-semibold text-white">{faq.question}</span>
                                {openIndex === idx ? (
                                    <Minus className="w-5 h-5 text-[var(--accent)]" />
                                ) : (
                                    <Plus className="w-5 h-5 text-[var(--text-gray)]" />
                                )}
                            </button>

                            <div
                                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <p className="text-[var(--text-gray)] leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
