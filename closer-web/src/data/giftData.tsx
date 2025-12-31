import { Coffee, Flame, Flower2, Gamepad2, Gift, Heart, Map, Package, Sparkles, Star, Ticket } from "lucide-react";

export interface GiftItem {
    id: string;
    name: string;
    price: number;
    category: 'romantic' | 'spicy' | 'servicing' | 'fun';
    icon: any; // JSX Element
    color: string;
    desc?: string;
}

export const GIFTS: GiftItem[] = [
    // ROMANTIC
    {
        id: 'date-1',
        name: 'Date Night Pass',
        price: 200,
        category: 'romantic',
        icon: <Ticket size={80} />,
        color: 'var(--love)',
        desc: 'Ticket to a date of your choice.'
    },
    {
        id: 'star-1',
        name: 'Stargazing',
        price: 0,
        category: 'romantic',
        icon: <Star size={80} />,
        color: 'var(--mist)',
        desc: 'A night under the stars, just us.'
    },
    {
        id: 'rose-1',
        name: 'Digital Rose',
        price: 50,
        category: 'romantic',
        icon: <Flower2 size={80} />,
        color: '#f43f5e',
        desc: 'A timeless symbol of romance.'
    },
    {
        id: 'bath-1',
        name: 'Bubble Bath',
        price: 20,
        category: 'romantic',
        icon: <Sparkles size={80} />,
        color: 'var(--mist)',
        desc: 'Relaxing bubble bath prepared for you.'
    },
    {
        id: 'picnic-1',
        name: 'Indoor Picnic',
        price: 15,
        category: 'romantic',
        icon: <Coffee size={80} />,
        color: 'var(--clay)',
        desc: 'Cozy indoor picnic with your favorite snacks.'
    },
    {
        id: 'cook-1',
        name: 'Dinner by Me',
        price: 0,
        category: 'romantic',
        icon: <Flame size={80} />,
        color: 'var(--sage)',
        desc: 'A homemade meal cooked with love.'
    },
    {
        id: 'choco-1',
        name: 'Sweet Treat',
        price: 75,
        category: 'romantic',
        icon: <Heart size={80} />,
        color: '#78350f',
        desc: 'Sweet treats for a sweet heart.'
    },
    {
        id: 'kiss-1',
        name: '1000 Kisses',
        price: 500,
        category: 'romantic',
        icon: <Heart size={80} fill="currentColor" />,
        color: '#e11d48',
        desc: 'Redeemable anytime, anywhere.'
    },


    // SPICY
    {
        id: 'fantasy-1',
        name: 'Secret Fantasy',
        price: 300,
        category: 'spicy',
        icon: <Sparkles size={80} />,
        color: 'var(--gold)',
        desc: 'Tell me a fantasy, and I will make it happen.'
    },
    {
        id: 'massage-oil',
        name: 'Massage Oil',
        price: 150,
        category: 'spicy',
        icon: <Package size={80} />,
        color: 'var(--clay)',
        desc: 'Sensual massage with premium oils.'
    },
    {
        id: 'massage-1',
        name: 'Massage Coupon',
        price: 100,
        category: 'spicy',
        icon: <Sparkles size={80} />,
        color: '#8b5cf6',
        desc: 'Good for a 20-minute relax session.'
    },


    // SERVICING
    {
        id: 'coffee-1',
        name: 'Morning Coffee',
        price: 25,
        category: 'servicing',
        icon: <Coffee size={80} />,
        color: 'var(--sand)',
        desc: 'Voucher for one coffee in bed.'
    },
    {
        id: 'clean-1',
        name: 'Chore Pass',
        price: 150,
        category: 'servicing',
        icon: <Package size={80} />,
        color: 'var(--stone)',
        desc: 'I will handle one chore for you.'
    },

    // FUN
    {
        id: 'mystery-1',
        name: 'Mystery Box',
        price: 50,
        category: 'fun',
        icon: <Gift size={80} />,
        color: 'var(--gold)',
        desc: 'What could be inside?'
    },
];

export const getGiftById = (id: string) => GIFTS.find(g => g.id === id);
