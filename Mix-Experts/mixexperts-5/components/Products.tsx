import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductsProps {
  products: Product[]; // Now accepts products as a prop
  onProductSelect?: (product: Product) => void;
}

export const Products: React.FC<ProductsProps> = ({ products, onProductSelect }) => {
  return (
    <section id="products" className="py-32 bg-[var(--bg-base)] border-t border-[var(--border-dark)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Shop Sounds</h2>
          <a href="#" className="hidden md:flex items-center gap-2 text-sm font-medium text-white hover:text-[var(--accent)] transition-colors group">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer"
              onClick={() => onProductSelect && onProductSelect(product)}
            >
              <div className="relative aspect-square bg-[var(--bg-card)] rounded-2xl overflow-hidden mb-6 border border-[var(--border-dark)] group-hover:border-[var(--accent-subtle)] transition-colors duration-300">
                {product.badge && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white text-[var(--bg-base)] text-[10px] font-bold uppercase tracking-wider rounded-full z-10">
                    {product.badge}
                  </span>
                )}
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
                
                <button className="absolute bottom-4 right-4 w-10 h-10 bg-white text-[var(--bg-base)] rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              
              <div>
                <div className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-2">
                  {product.type}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-bold text-white group-hover:text-[var(--accent)] transition-colors">
                    {product.title}
                  </h3>
                  <span className="text-white font-medium">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden text-center">
             <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-[var(--accent)] transition-colors">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};