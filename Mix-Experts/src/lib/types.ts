import { LucideIcon } from "lucide-react";

export interface Service {
    id: string;
    title: string;
    price: string;
    description: string;
    turnaround: string;
    features: string[];
    icon?: LucideIcon;
}

export interface Product {
    id: string;
    type: string;
    title: string;
    price: string;
    description?: string;
    image: string;
    badge?: string;
    demoAudio?: string;
}

export interface Testimonial {
    id: string;
    text: string;
    author: string;
    project: string;
    image: string;
}

export interface PortfolioItem {
    id: string;
    title: string;
    artist: string;
    image: string;
}

export interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

export type ThemeName = 'amber' | 'teal' | 'sage' | 'slate' | 'rose' | 'violet';

export interface ThemeColors {
    accent: string;
    accentLight: string;
    accentSubtle: string;
    accentGlow: string;
}

// Phase 1 Retrofit Types

export interface ServiceExtended extends Service {
    termsAndConditions?: string;
    revisionPolicy?: {
        includedRevisions: number;
        extraRevisionPrice: number;
    };
    refundPolicy?: string;
    cancellationPolicy?: string;
    requirements?: string[];
    deliveryFormats?: string[];
    turnaroundOptions?: {
        standard: { days: string; price: number };
        rush?: { days: string; priceMultiplier: number };
        priority?: { days: string; priceMultiplier: number };
    };
    addOns?: {
        id: string;
        name: string;
        description?: string;
        price: number;
    }[];
}

export interface ProductExtended extends Product {
    licenseType?: 'personal' | 'commercial' | 'unlimited' | 'custom';
    licenseTerms?: string;
    usageRestrictions?: {
        allowCommercialUse: boolean;
        allowDerivativeWorks: boolean;
        allowRedistribution: boolean;
        allowResale: boolean;
        requireAttribution: boolean;
    };
    refundPolicy?: 'no-refunds' | 'before-download' | 'custom';
    customRefundPolicy?: string;
    compatibleDAWs?: string[];
    fileFormats?: string[];
    fileSize?: string;
    version?: string;
}

export type OrderStatus =
    | 'pending_payment'
    | 'payment_processing'
    | 'paid'
    | 'received'
    | 'in_progress'
    | 'mixing'
    | 'mastering'
    | 'review'
    | 'revision_requested'
    | 'revision_in_progress'
    | 'pending_approval'
    | 'completed'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface ProjectStatusEntry {
    status: OrderStatus;
    updatedAt: Date;
    updatedBy: 'engineer' | 'client' | 'system';
    note?: string;
}

export interface ProjectTimeline {
    projectId: string;
    history: ProjectStatusEntry[];
    currentStatus: ProjectStatusEntry;
}

export interface RevisionRequest {
    id: string;
    projectId: string;
    revisionNumber: number;
    requestedAt: Date;
    requestedBy: string;
    notes: string;
    timestamps?: { time: string; note: string }[];
    status: 'pending' | 'in_progress' | 'completed';
    completedAt?: Date;
}

export interface ProjectRevisions {
    projectId: string;
    includedRevisions: number;
    usedRevisions: number;
    extraRevisionPrice: number;
    revisions: RevisionRequest[];
}

export interface MessageTemplate {
    id: string;
    engineerId: string;
    name: string;
    content: string;
    shortcut: string;
}
