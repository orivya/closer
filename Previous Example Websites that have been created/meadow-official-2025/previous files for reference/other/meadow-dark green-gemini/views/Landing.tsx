import React, { useEffect, useState } from 'react';
import { ArrowRight, Leaf, Lock, Sparkles, Scale, BookOpen } from 'lucide-react';
import { Button, GlassCard } from '../components/ui';

interface LandingProps {
  onEnterApp: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onEnterApp }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-sage-900 bg-cream selection:bg-sage-200">
      {/* Navigation */}
      <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-black/5 py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-sage-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-sage-500/20 group-hover:scale-105 transition-transform">
              <Leaf size={20} />
            </div>
            <span className="font-serif text-xl font-medium tracking-tight">Meadow</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={onEnterApp} className="hidden sm:flex">Log In</Button>
            <Button onClick={onEnterApp}>Start Journaling</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-48 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-50 border border-sage-200/50 rounded-full text-sage-600 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles size={14} />
          AI-Powered Self-Discovery
        </div>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-sage-900 leading-[0.95] mb-8 animate-fade-up">
          See yourself<br />
          <em className="font-light text-sage-500 italic">clearly</em>
        </h1>
        <p className="text-lg md:text-xl text-sage-700/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
          A thoughtful space to capture your inner world, discover patterns, and find clarity through journaling.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Button onClick={onEnterApp} className="h-14 px-8 text-lg">
            Begin your journal <ArrowRight size={18} />
          </Button>
          <Button variant="secondary" onClick={onEnterApp} className="h-14 px-8 text-lg">
            Take a tour
          </Button>
        </div>
      </section>

      {/* Features Grid (Bento Style) */}
      <section className="py-24 px-6 bg-white/40 border-t border-black/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sage-500 font-bold uppercase tracking-widest text-xs">Why Meadow</span>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 text-sage-900">Tools for your inner world</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-10 flex flex-col items-center text-center group" hoverEffect={false}>
              <div className="w-16 h-16 bg-cream rounded-2xl border border-sage-100 flex items-center justify-center text-sage-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Lock size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-3">The Vault</h3>
              <p className="text-sage-600 font-light leading-relaxed">Send letters to your future self. Lock them away for months or years to rediscover later.</p>
            </GlassCard>

            <GlassCard className="p-10 flex flex-col items-center text-center group" hoverEffect={false}>
              <div className="w-16 h-16 bg-cream rounded-2xl border border-sage-100 flex items-center justify-center text-sage-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-3">The Mirror</h3>
              <p className="text-sage-600 font-light leading-relaxed">AI that gently reflects your patterns back to you, helping you connect the dots without judgement.</p>
            </GlassCard>

            <GlassCard className="p-10 flex flex-col items-center text-center group" hoverEffect={false}>
              <div className="w-16 h-16 bg-cream rounded-2xl border border-sage-100 flex items-center justify-center text-sage-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Scale size={32} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Decision Lab</h3>
              <p className="text-sage-600 font-light leading-relaxed">A structured space to weigh pros and cons, overcome fear, and make clear choices.</p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Simple How-To */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sage-500 font-bold uppercase tracking-widest text-xs">How it works</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3 mb-16 text-sage-900">Simple by design</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-sage-200 to-transparent"></div>

            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 bg-white border border-sage-100 rounded-full flex items-center justify-center text-3xl font-serif text-sage-500 shadow-xl shadow-sage-500/5 mb-6 z-10">1</div>
              <h3 className="font-serif text-xl mb-2">Write anything</h3>
              <p className="text-sm text-sage-600 leading-relaxed max-w-[200px]">A decision, a feeling, a rambling thought. There's no wrong way to start.</p>
            </div>
            
            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 bg-white border border-sage-100 rounded-full flex items-center justify-center text-3xl font-serif text-sage-500 shadow-xl shadow-sage-500/5 mb-6 z-10">2</div>
              <h3 className="font-serif text-xl mb-2">Notice what matters</h3>
              <p className="text-sm text-sage-600 leading-relaxed max-w-[200px]">Connections and reflections surface — gently, and only when helpful.</p>
            </div>

            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 bg-white border border-sage-100 rounded-full flex items-center justify-center text-3xl font-serif text-sage-500 shadow-xl shadow-sage-500/5 mb-6 z-10">3</div>
              <h3 className="font-serif text-xl mb-2">Understand yourself</h3>
              <p className="text-sm text-sage-600 leading-relaxed max-w-[200px]">See what you've been thinking about. Trust your own wisdom again.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-black/5 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale">
            <Leaf size={16} />
            <span className="font-serif font-medium">Meadow</span>
          </div>
          <p className="text-sage-400 text-sm">© 2026 Meadow Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
