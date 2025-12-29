import React from 'react';
import { GEAR_ITEMS } from '../constants';

export const GearGrid: React.FC = () => {
  return (
    <section className="py-32 bg-[var(--bg-base)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Sonic Arsenal</h2>
          <p className="text-[var(--text-gray)] max-w-sm text-right">
            A hybrid blend of vintage analog character and modern digital precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
          {GEAR_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className={`${item.span} group relative rounded-3xl overflow-hidden border border-[var(--border-dark)] bg-[var(--bg-card)]`}
            >
              <img 
                src={item.image} 
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="w-12 h-12 mb-4 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-[var(--accent)] group-hover:border-[var(--accent)] transition-colors duration-300">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{item.name}</h3>
                <p className="text-[var(--text-gray)] font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};