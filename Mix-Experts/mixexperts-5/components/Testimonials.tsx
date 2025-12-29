import React from 'react';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../constants';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-32 bg-[var(--bg-base)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-16 text-center">Artist Stories</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="bg-[var(--bg-card)] border border-[var(--border-dark)] p-8 rounded-3xl relative overflow-hidden group hover:bg-[var(--bg-elevated)] transition-colors duration-300">
              <div className="flex gap-1 mb-6 text-[var(--accent)] opacity-80">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-[var(--text-gray)] leading-relaxed mb-8 text-lg font-light">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.image} alt={t.author} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                <div>
                  <div className="text-sm font-bold text-white">{t.author}</div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t.project}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};