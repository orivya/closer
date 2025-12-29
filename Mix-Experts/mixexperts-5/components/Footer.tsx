import React from 'react';
import { Instagram, Youtube, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border-dark)] py-12 bg-[var(--bg-base)]">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight">JAMES MIX</span>
            <div className="w-1 h-1 rounded-full bg-[var(--accent)]"></div>
          </div>

          <div className="text-sm text-[var(--text-muted)]">
            © 2026 James Mix. All rights reserved.
          </div>
          
          <div className="flex gap-6">
            <a href="#" className="text-[var(--text-gray)] hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-[var(--text-gray)] hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-[var(--text-gray)] hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
      </div>
    </footer>
  );
};