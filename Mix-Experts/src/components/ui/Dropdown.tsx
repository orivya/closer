'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MoreHorizontal } from 'lucide-react';

interface DropdownItem {
    label: string;
    icon?: React.ElementType;
    onClick: () => void;
    className?: string; // For destructive actions like delete
}

interface DropdownProps {
    items: DropdownItem[];
    trigger?: React.ReactNode; // Defaults to MoreHorizontal if not provided
    align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
    items,
    trigger,
    align = 'right'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle Escape key to close dropdown
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    const toggleDropdown = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if trigger is inside a link
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {trigger ? (
                <div onClick={toggleDropdown} className="cursor-pointer">
                    {trigger}
                </div>
            ) : (
                <button
                    ref={triggerRef}
                    onClick={toggleDropdown}
                    className="p-2 text-[var(--text-muted)] hover:text-white transition-colors rounded-full hover:bg-[var(--bg-elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-base)]"
                    aria-label="More options"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                >
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        role="menu"
                        aria-orientation="vertical"
                        className={cn(
                            "absolute z-50 mt-2 w-48 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-dark)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] backdrop-blur-xl overflow-hidden ring-1 ring-white/5",
                            align === 'right' ? "right-0" : "left-0"
                        )}
                    >
                        <div className="py-1">
                            {items.map((item, index) => (
                                <button
                                    key={index}
                                    role="menuitem"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        item.onClick();
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent)]",
                                        item.className
                                            ? item.className
                                            : "text-[var(--text-gray)] hover:bg-[var(--bg-hover)] hover:text-white"
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon className={cn(
                                            "w-4 h-4 transition-colors",
                                            item.className ? "" : "text-[var(--text-muted)] group-hover:text-white"
                                        )} aria-hidden="true" />
                                    )}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
