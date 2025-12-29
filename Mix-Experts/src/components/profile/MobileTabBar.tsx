'use client';

import React, { useState, useEffect } from 'react';
import { Home, Headphones, Sliders, ShoppingBag, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface MobileTabBarProps {
    username?: string;
    showShop?: boolean; // Determine if Shop tab should be shown
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({ username, showShop = true }) => {
    const [activeTab, setActiveTab] = useState('home');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Smart Hide on Scroll Down, Show on Scroll Up
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Scrolling down - hide
            } else {
                setIsVisible(true); // Scrolling up - show
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const scrollTo = (id: string) => {
        setActiveTab(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        } else if (id === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // The "Absolute Best" Icons for a Mix Engineer App
    const tabs = [
        { id: 'home', label: 'Home', icon: Home, action: () => scrollTo('home') },
        { id: 'demo', label: 'Listen', icon: Headphones, action: () => scrollTo('demo') },
        { id: 'services', label: 'Services', icon: Sliders, action: () => scrollTo('services') },
        ...(showShop ? [{ id: 'products', label: 'Shop', icon: ShoppingBag, action: () => scrollTo('products') }] : []),
        { id: 'contact', label: 'Contact', icon: MessageSquare, action: () => scrollTo('booking') }
    ];

    return (
        <div className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50 transition-all duration-300 md:hidden",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
        )}>
            <div className="flex items-center justify-between bg-[rgba(20,20,23,0.85)] backdrop-blur-xl border border-white/10 rounded-2xl px-2 py-3 shadow-2xl shadow-black/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={tab.action}
                        className={cn(
                            "flex flex-col items-center justify-center w-full gap-1 transition-all duration-300 relative",
                            activeTab === tab.id ? "text-[var(--accent)]" : "text-[var(--text-gray)] hover:text-white"
                        )}
                    >
                        {/* Active Indicator Dot */}
                        {activeTab === tab.id && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
                        )}

                        <tab.icon className={cn(
                            "transition-all duration-300",
                            activeTab === tab.id ? "w-6 h-6 fill-current/20" : "w-5 h-5"
                        )} />

                        <span className="text-[10px] font-medium tracking-wide">
                            {tab.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
