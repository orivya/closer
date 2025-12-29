import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';

const EXAMPLES = [
    { name: "Sarah Vocalist", role: "Vocal Producer", image: "bg-purple-500", tags: ["Pop", "R&B"] },
    { name: "Mike The Mixer", role: "Mixing Engineer", image: "bg-blue-500", tags: ["Rock", "Metal"] },
    { name: "Neon Studios", role: "Mastering House", image: "bg-pink-500", tags: ["EDM", "House"] },
    { name: "Acoustic Vibes", role: "Recording Studio", image: "bg-amber-500", tags: ["Folk", "Jazz"] },
    { name: "Trap Lord", role: "Beatmaker", image: "bg-red-500", tags: ["Hip Hop", "Trap"] },
    { name: "Cinematic Sound", role: "Sound Designer", image: "bg-cyan-500", tags: ["Score", "Ambient"] },
];

interface ExamplesGridProps {
    searchTerm?: string;
}

export const ExamplesGrid = ({ searchTerm = '' }: ExamplesGridProps) => {
    const filteredExamples = EXAMPLES.filter(example =>
        example.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        example.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filteredExamples.length === 0) {
        return (
            <div className="text-center py-24 border border-dashed border-[var(--border-dark)] rounded-2xl">
                <p className="text-[var(--text-gray)]">No examples found matching "{searchTerm}"</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExamples.map((example, i) => (
                <Link
                    href="/demo"
                    key={i}
                    className="group relative bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 block"
                >
                    {/* Image Mock */}
                    <div className={`w-full h-48 ${example.image} opacity-20 group-hover:opacity-30 transition-opacity`} />

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-[var(--accent)] transition-colors">{example.name}</h3>
                                <p className="text-[var(--text-muted)] text-sm">{example.role}</p>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex gap-2">
                            {example.tags.map(tag => (
                                <span key={tag} className="text-xs font-bold px-2 py-1 rounded bg-[var(--bg-card)] border border-[var(--border-dark)] text-[var(--text-gray)]">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Play Button Overlay (Mock) */}
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                </Link>
            ))}
        </div>
    );
};
