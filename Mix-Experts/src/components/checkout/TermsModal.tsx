'use client';

import React, { useEffect, useRef } from 'react';
import { X, FileText, Check } from 'lucide-react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    termsContent: string;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept, termsContent }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Store the element that triggered the modal
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement as HTMLElement;
            // Focus the close button when modal opens
            setTimeout(() => closeButtonRef.current?.focus(), 100);
        } else {
            // Return focus to trigger element on close
            if (previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        }
    }, [isOpen]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus trap
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const modal = modalRef.current;
        const focusableElements = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement?.focus();
                    e.preventDefault();
                }
            }
        };

        modal.addEventListener('keydown', handleTab);
        return () => modal.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="terms-modal-title" aria-describedby="terms-modal-description">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

            <div ref={modalRef} className="relative w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">

                {/* Header */}
                <div className="p-6 border-b border-[var(--border-dark)] flex items-center justify-between">
                    <div>
                        <h3 id="terms-modal-title" className="text-xl font-bold text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                            Terms of Service
                        </h3>
                        <p id="terms-modal-description" className="text-sm text-[var(--text-muted)]">Please review the agreement before proceeding.</p>
                    </div>
                    <button ref={closeButtonRef} onClick={onClose} className="p-2 rounded-full hover:bg-[var(--bg-hover)] text-[var(--text-gray)] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg-elevated)]" aria-label="Close modal">
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-base)]">
                    <div className="prose prose-invert prose-sm max-w-none text-[var(--text-gray)]">
                        {termsContent ? (
                            <div className="whitespace-pre-wrap">{termsContent}</div>
                        ) : (
                            <p className="italic text-[var(--text-muted)]">No specific terms provided for this service.</p>
                        )}

                        <hr className="border-[var(--border-dark)] my-6" />

                        <h4 className="text-white font-bold mb-2">Standard Platform Policies</h4>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>All revisions must be requested within 7 days of delivery.</li>
                            <li>Files are stored for 30 days after project completion.</li>
                            <li>Refunds are subject to the engineer's specific policy.</li>
                        </ul>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border-dark)] flex justify-end gap-3 bg-[var(--bg-card)]">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-sm font-bold text-[var(--text-gray)] hover:text-white transition-colors"
                    >
                        Decline
                    </button>
                    <button
                        onClick={onAccept}
                        className="px-8 py-2.5 bg-[var(--accent)] text-white font-bold rounded-xl shadow-lg hover:bg-[var(--accent-light)] transition-colors flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        I Agree & Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
