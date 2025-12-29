import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';

export const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Work', href: '#demo' },
    { name: 'Presets', href: '#products' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b ${isScrolled ? 'h-20 glass-nav border-[var(--border-dark)]' : 'h-24 bg-transparent border-transparent'}`}>
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo / Name */}
        <a href="#" className="flex items-center gap-2 group relative z-50">
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-[var(--accent)] transition-colors duration-300">JAMES MIX</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mb-0.5"></div>
        </a>

        {/* Desktop Links - Minimal & Centered */}
        <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] backdrop-blur-sm">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-5 py-2 text-sm font-medium text-[var(--text-gray)] hover:text-white transition-all duration-300 rounded-full hover:bg-[rgba(255,255,255,0.05)]"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-[var(--text-gray)] hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
          <a
            href="#contact"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-full transition-all duration-300 backdrop-blur-sm"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[var(--bg-base)] z-40 flex flex-col items-center justify-center transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-6 text-center">
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-3xl font-bold text-white hover:text-[var(--accent)] transition-all duration-300 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className={`mt-4 px-8 py-4 text-lg font-bold text-[var(--bg-base)] bg-white rounded-full ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
            style={{ transitionDelay: '400ms' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Work With Me
          </a>
        </div>
      </div>
    </nav>
  );
};