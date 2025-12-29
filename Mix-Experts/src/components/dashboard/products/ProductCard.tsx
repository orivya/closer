'use client';

import React from 'react';
import { MoreHorizontal, Download, Music } from 'lucide-react';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
    product: Product;
    onEdit: (product: Product) => void;
}

const categoryLabels: Record<string, string> = {
    preset: 'Preset Pack',
    sample_pack: 'Sample Pack',
    template: 'Template',
    course: 'Course',
    ebook: 'E-Book',
    other: 'Digital Product'
};

export const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit }) => {
    return (
        <article
            className="group relative bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-2xl overflow-hidden hover:border-[var(--accent)] transition-all duration-300 cursor-pointer flex flex-col focus-within:ring-2 focus-within:ring-[var(--accent)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--bg-base)]"
            onClick={() => onEdit(product)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit(product);
                }
            }}
            aria-label={`${product.name} - $${product.price.toFixed(2)} ${product.is_active ? '' : '(Inactive)'}`}
        >
            {/* Cover Image Area */}
            <div className="aspect-square w-full bg-[var(--bg-elevated)] relative overflow-hidden">
                {product.cover_image_url ? (
                    <img
                        src={product.cover_image_url}
                        alt={`Cover image for ${product.name}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]" role="img" aria-label="No cover image">
                        <Music className="w-16 h-16" aria-hidden="true" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Add dropdown menu handler here
                        }}
                        className="p-2 bg-black/50 backdrop-blur-md text-white rounded-full hover:bg-[var(--accent)] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                        aria-label={`More options for ${product.name}`}
                    >
                        <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Type Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/10" aria-label={`Product type: ${categoryLabels[product.category] || product.category}`}>
                    {categoryLabels[product.category] || product.category}
                </div>

                {/* Inactive Badge */}
                {!product.is_active && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-red-500/90 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wide" role="status" aria-label="Product is inactive">
                        Inactive
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-lg font-bold text-white whitespace-nowrap ml-4">
                        ${product.price.toFixed(2)}
                    </p>
                </div>

                <p className="text-sm text-[var(--text-gray)] line-clamp-2 mb-4 flex-1">
                    {product.description || 'No description'}
                </p>

                {/* Footer Stats */}
                <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-dark)] text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{product.download_count} Downloads</span>
                    </div>
                    {product.preview_url && (
                        <div className="flex items-center gap-1.5 text-[var(--accent)]">
                            <Music className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Preview Ready</span>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
};
