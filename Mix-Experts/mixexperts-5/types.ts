import { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  icon: LucideIcon;
}

export interface Product {
  id: string;
  type: string;
  title: string;
  price: string;
  image: string;
  badge?: string;
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