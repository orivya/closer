'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
    question: string;
    children: React.ReactNode;
}

export function Accordion({ question, children }: AccordionProps) {
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (isOpen) {
            const scrollHeight = contentRef.current?.scrollHeight;
            setHeight(scrollHeight || 0);
        } else {
            setHeight(0);
        }
    }, [isOpen]);

    return (
        <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <span className="font-bold text-white">{question}</span>
                <ChevronDown
                    className={`w-5 h-5 text-[var(--text-gray)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                style={{ height }}
                className="transition-[height] duration-300 ease-in-out overflow-hidden"
            >
                <div ref={contentRef} className="p-4 pt-0 text-[var(--text-gray)] leading-relaxed">
                    {children}
                </div>
            </div>
        </div>
    );
}
