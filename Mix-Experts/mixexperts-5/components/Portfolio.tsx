import React from 'react';
import { Play } from 'lucide-react';
import { PORTFOLIO_ITEMS } from '../constants';

export const Portfolio: React.FC = () => {
  return (
    <section id="portfolio" className="py-24 border-t border-[var(--border-dark)]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-[var(--accent)] opacity-50"></span>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em]">Recent Work</span>
            <span className="w-8 h-px bg-[var(--accent)] opacity-50"></span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Featured Projects</h2>
          <p className="text-[var(--text-gray)]">A selection of tracks I've mixed and mastered</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {PORTFOLIO_ITEMS.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[var(--accent)] rounded-full flex items-center justify-center text-white scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                  <Play className="w-6 h-6 fill-current ml-1" />
                </div>
                <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                <p className="text-[var(--text-gray)] text-sm mt-1">{item.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};