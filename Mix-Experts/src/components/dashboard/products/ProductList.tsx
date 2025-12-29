'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product } from '@/hooks/useProducts';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onCreate: () => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onCreate }) => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Create New Card */}
            <button
                onClick={onCreate}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-dashed border-[var(--border-dark)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[var(--accent)] transition-all duration-300 min-h-[300px]"
            >
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-dark)] flex items-center justify-center text-[var(--text-muted)] mb-6 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all duration-300">
                    <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">New Product</h3>
                <p className="text-sm text-[var(--text-muted)] text-center px-4">
                    Upload presets, samples, or templates
                </p>
            </button>

            {/* Existing Products */}
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onEdit={onEdit} />
            ))}
        </div>
    );
};
