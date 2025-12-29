import { Music2, Sliders, Mic2, Cpu, Speaker, Radio, Layers, Zap } from "lucide-react";
import { Service, Product, Testimonial, PortfolioItem, FAQItem, ThemeColors, ThemeName } from "./types";

export const THEMES: Record<ThemeName, ThemeColors> = {
  amber: {
    accent: '#C9956C',
    accentLight: '#D4A97E',
    accentSubtle: 'rgba(201, 149, 108, 0.1)',
    accentGlow: 'rgba(201, 149, 108, 0.4)',
  },
  teal: {
    accent: '#5BA4A4',
    accentLight: '#6FB8B8',
    accentSubtle: 'rgba(91, 164, 164, 0.1)',
    accentGlow: 'rgba(91, 164, 164, 0.4)',
  },
  sage: {
    accent: '#7D9B8A',
    accentLight: '#8FA897',
    accentSubtle: 'rgba(125, 155, 138, 0.1)',
    accentGlow: 'rgba(125, 155, 138, 0.4)',
  },
  slate: {
    accent: '#6B8CAE',
    accentLight: '#7D9BBD',
    accentSubtle: 'rgba(107, 140, 174, 0.1)',
    accentGlow: 'rgba(107, 140, 174, 0.4)',
  },
  rose: {
    accent: '#B88B8B',
    accentLight: '#C69D9D',
    accentSubtle: 'rgba(184, 139, 139, 0.1)',
    accentGlow: 'rgba(184, 139, 139, 0.4)',
  },
  violet: {
    accent: '#9B8BB8',
    accentLight: '#AB9CC6',
    accentSubtle: 'rgba(155, 139, 184, 0.1)',
    accentGlow: 'rgba(155, 139, 184, 0.4)',
  },
};

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Full Mix',
    price: 'Starting at $350',
    description: 'Complete mixing from stems to master-ready. Every track balanced, polished, and radio-ready.',
    features: ['Unlimited revisions', '3-5 day turnaround', 'Stem delivery included'],
    icon: Sliders
  },
  {
    id: '2',
    title: '2 Track Mix',
    price: 'Starting at $150',
    description: 'Perfect for artists with a beat and vocal. Quick turnaround with professional results.',
    features: ['2 revisions included', '48 hour turnaround', 'Beat + vocal optimization'],
    icon: Mic2
  },
  {
    id: '3',
    title: 'Mastering',
    price: 'Starting at $75',
    description: 'Final polish and loudness optimization for streaming platforms and radio.',
    features: ['2 revisions included', '24-48 hour delivery', 'All streaming formats'],
    icon: Music2
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    type: 'Vocal Preset',
    title: 'R&B Vocal Preset Pack',
    price: '$29',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop',
    badge: 'Best Seller'
  },
  {
    id: '2',
    type: 'Vocal Preset',
    title: 'Rap Vocal Preset',
    price: '$24',
    image: 'https://images.unsplash.com/photo-1558584673-b2cf7c8e6c5c?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    type: 'Recording Template',
    title: 'Logic Pro Recording Template',
    price: '$39',
    image: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400&h=400&fit=crop',
    badge: 'New'
  },
  {
    id: '4',
    type: 'Vocal Preset',
    title: 'Pop Vocal Chain',
    price: '$19',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    text: "Amazing work! The mix came out exactly how I envisioned. Will definitely be back for future projects.",
    author: "Alex Rivera",
    project: "Summer Nights EP",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: '2',
    text: "Fast turnaround and excellent communication. The final product exceeded my expectations.",
    author: "Marcus Chen",
    project: "Neon Lights Single",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
  },
  {
    id: '3',
    text: "Professional quality at a fair price. I've worked with many engineers and this is top tier.",
    author: "Sarah Jones",
    project: "Acoustic Sessions",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces"
  }
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Midnight Drive',
    artist: 'The Night Shift',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  },
  {
    id: '2',
    title: 'Neon Dreams',
    artist: 'Luna Ray',
    image: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop'
  },
  {
    id: '3',
    title: 'Urban Soul',
    artist: 'Marcus V',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop'
  },
  {
    id: '4',
    title: 'Golden Hour',
    artist: 'Summer Collective',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: '1',
    question: "What's your turnaround time for mixing?",
    answer: "Standard turnaround is 3-5 business days for a full mix. 2 Track mixes are typically 48 hours. Rush delivery is available for an additional fee."
  },
  {
    id: '2',
    question: "Do your presets work with stock plugins?",
    answer: "Yes! Most of my presets are designed to work with stock plugins in your DAW, so you don't need expensive third-party software."
  },
  {
    id: '3',
    question: "How many revisions are included?",
    answer: "Full mix packages include unlimited revisions. 2 Track mixes and mastering include 2 rounds of revisions."
  },
  {
    id: '4',
    question: "What file formats do you accept?",
    answer: "I accept WAV, AIFF, or FLAC files. For mixing, please export stems at 24-bit/48kHz or higher. For mastering, send a stereo mix with at least -6dB of headroom."
  },
  {
    id: '5',
    question: "Do you offer sample masters?",
    answer: "Yes — I offer free sample masters so you can hear the difference before committing. Just send me your mix and I'll master the first 30 seconds."
  }
];

export const GEAR_ITEMS = [
  {
    id: 1,
    name: "Analog Chain",
    desc: "Tube warmth & saturation",
    icon: Radio,
    span: "col-span-1 md:col-span-2",
    image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Monitoring",
    desc: "Precision ATC System",
    icon: Speaker,
    span: "col-span-1",
    image: "https://images.unsplash.com/photo-1519508234439-4f23643125c1?w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Conversion",
    desc: "High-fidelity A/D D/A",
    icon: Layers,
    span: "col-span-1",
    image: "https://images.unsplash.com/photo-1558498871-337d1d234dc8?w=800&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Processing",
    desc: "Hybrid digital/analog workflow",
    icon: Cpu,
    span: "col-span-1 md:col-span-2",
    image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop"
  }
];