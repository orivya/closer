
import React, { useEffect, useState, useRef } from 'react';
import {
   ArrowRight, Feather, Activity, Calendar,
   Leaf, Play, Lock, Sparkles, Scale, Network, Archive,
   Check, GitBranch, Shield, Eye, FileText, Image as ImageIcon,
} from 'lucide-react';

interface LandingPageProps {
   onEnterApp: () => void;
   onLogin?: () => void;
   onNavigate?: (path: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onLogin, onNavigate }) => {
   // Helper for navigating to public pages
   const navigateTo = (path: string) => {
      if (onNavigate) {
         onNavigate(path);
      } else {
         window.location.href = path;
      }
   };
   const [scrolled, setScrolled] = useState(false);
   const heroRef = useRef<HTMLDivElement>(null);
   const scrollToSection = (id: string) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
   };

   useEffect(() => {
      const handleScroll = () => {
         setScrolled(window.scrollY > 50);
         if (heroRef.current) {
            const scrolled = window.scrollY;
            // Parallax fade effect for hero
            heroRef.current.style.transform = `translate3d(0, ${scrolled * 0.15}px, 0)`;
            heroRef.current.style.opacity = `${Math.max(0, 1 - scrolled / 700)}`;
         }
      };
      window.addEventListener('scroll', handleScroll);

      // Intersection Observer for smooth reveal animations
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((entry) => {
               if (entry.isIntersecting) {
                  entry.target.classList.add('animate-fade-up');
                  entry.target.classList.remove('opacity-0', 'translate-y-8');
               }
            });
         },
         { threshold: 0.1 }
      );

      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

      return () => {
         window.removeEventListener('scroll', handleScroll);
         observer.disconnect();
      };
   }, []);

   return (
      <div className="relative font-sans text-text-primary bg-dark-base overflow-hidden selection:bg-sage/20 selection:text-sage">

         {/* --- CINEMATIC GRAIN OVERLAY --- */}
         <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.02] mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")` }}
         />

         {/* Global CSS for custom animations */}
         <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-15px) rotate(-4deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(4deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite 1s; }
        
        /* 3D Perspective Utilities */
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-12 { transform: rotateY(-12deg) rotateX(5deg); }
        .group:hover .rotate-y-0 { transform: rotateY(0) rotateX(0); }
        
        /* Premium Card Hover Effect */
        .premium-card-shadow {
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.02),
            0 10px 15px -3px rgba(0, 0, 0, 0.04),
            0 0 0 1px rgba(255, 255, 255, 0.8) inset; 
        }
        .premium-card-hover:hover {
          box-shadow: 
            0 20px 25px -5px rgba(0, 0, 0, 0.05),
            0 8px 10px -6px rgba(0, 0, 0, 0.01),
            0 0 0 1px rgba(125, 155, 138, 0.2) inset;
        }

      `}</style>

         {/* --- CINEMATIC HERO --- */}
         {/* Reduced padding top to center elements better in viewport */}
         <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-32">
            {/* Ambient glow (cream-friendly) */}
            <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-[880px] h-[880px] bg-gradient-radial from-sage/20 via-transparent to-transparent opacity-60 pointer-events-none blur-3xl" />

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-4' : 'py-8'}`}>
               <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
                  <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                     <div className="w-8 h-8 rounded-xl bg-sage text-white flex items-center justify-center shadow-glow">
                        <Leaf size={16} fill="currentColor" />
                     </div>
                     <span className="font-serif text-xl font-medium text-text-primary tracking-tight">Meadow</span>
                  </div>

                  {/* Subtle nav links (desktop) */}
                  <div className="hidden md:flex items-center gap-10">
                     <button
                        type="button"
                        onClick={() => scrollToSection('features')}
                        className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                     >
                        Features
                     </button>
                     <button
                        type="button"
                        onClick={() => scrollToSection('how-it-works')}
                        className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                     >
                        How it works
                     </button>
                     <button
                        type="button"
                        onClick={() => navigateTo('/pricing')}
                        className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                     >
                        Pricing
                     </button>
                  </div>

                  <div className="flex items-center gap-6">
                     <button onClick={onLogin || onEnterApp} className="hidden md:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Log In</button>
                     <button onClick={onEnterApp} className="bg-sage text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:shadow-[0_6px_20px_rgba(107,143,122,0.5)] transition-all hover:-translate-y-0.5">
                        Start Journaling
                     </button>
                  </div>
               </div>
            </nav>

            {/* Hero Content & Visuals */}
            <div
               ref={heroRef}
               className="max-w-4xl mx-auto px-6 text-center z-10 relative mt-8"
               style={{ willChange: 'transform, opacity' }}
            >

               {/* FLOATING CONTENT CARDS - SYMMETRICAL & WIDER SPREAD */}
               {/* Changed bottom to -24 and left/right to -48 to push them away from the center text */}

               {/* Bottom Left - Universal Note */}
               <div className="absolute -bottom-24 -left-12 lg:-left-48 hidden md:block animate-float-slow" style={{ zIndex: 20 }}>
                  <div className="glass-card-elevated p-4 rounded-2xl w-60 text-left transform hover:scale-105 transition-transform duration-300">
                     <div className="flex gap-2 items-center mb-2">
                        <div className="w-6 h-6 rounded-full bg-sage-subtle flex items-center justify-center text-sage border border-sage-border"><FileText size={12} /></div>
                        <span className="text-[10px] font-bold text-sage uppercase tracking-wider">Note</span>
                     </div>
                     <div className="space-y-1">
                        <p className="font-serif text-xs text-text-primary leading-relaxed">"I'm learning to trust the pace of my own life."</p>
                     </div>
                  </div>
               </div>

               {/* Bottom Right - Connecting */}
               <div className="absolute -bottom-24 -right-12 lg:-right-48 hidden md:block animate-float-delayed" style={{ zIndex: 20 }}>
                  <div className="glass-card-elevated p-4 rounded-2xl w-60 text-left transform hover:scale-105 transition-transform duration-300">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-sage-subtle flex items-center justify-center text-sage border border-sage-border"><GitBranch size={12} /></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage">Connecting...</span>
                     </div>
                     <div className="pl-3 border-l-2 border-sage/30">
                        <p className="text-xs text-text-secondary leading-relaxed">"This connects to your entry about <span className="text-text-primary font-medium">Patience</span>."</p>
                     </div>
                  </div>
               </div>


               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-surface border border-sage-border text-sage text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in relative z-10">
                  <Sparkles size={12} /> A sanctuary for your mind
               </div>

               {/* Tighter spacing: Reduced mb and pb */}
               <h1
                  className="font-serif text-6xl md:text-8xl leading-[0.95] text-text-primary mb-5 tracking-tight opacity-0 animate-fade-up relative z-10"
                  style={{ animationDelay: '0.2s', textWrap: 'balance' as any }}
               >
                  See yourself <br />
                  {/* Added pb-4 to fix clipped 'y' */}
                  <span className="relative inline-block text-sage pb-4">
                     clearly.
                  </span>
               </h1>

               <p
                  className="text-xl text-text-secondary font-light max-w-lg mx-auto mb-12 opacity-0 animate-fade-up leading-relaxed relative z-10"
                  style={{ animationDelay: '0.4s', textWrap: 'balance' as any }}
               >
                  Meadow isn't just a place to write notes—it's a mirror that reflects your growth, patterns, and clarity back to you.
               </p>

               <div className="flex flex-col items-center justify-center gap-12 opacity-0 animate-fade-up relative z-10" style={{ animationDelay: '0.6s' }}>
                  <button
                     onClick={onEnterApp}
                     className="group relative px-10 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:shadow-[0_6px_20px_rgba(107,143,122,0.5)] transition-all hover:-translate-y-1 overflow-hidden"
                  >
                     <span className="relative z-10 flex items-center gap-2">Start your journal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></span>
                  </button>
               </div>
            </div>

            {/* Gradient Fade to Next Section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-base to-transparent pointer-events-none" />
         </div>


         {/* --- FEATURE 1: THE STREAM --- */}
         <section id="features" className="relative py-32 px-6 scroll-mt-28">
            <div className="max-w-7xl mx-auto">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                  <div className="order-2 lg:order-1 relative reveal opacity-0 translate-y-8 transition-all duration-700">
                     {/* Decorative Background Blob */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-sage/[0.03] rounded-full blur-[100px] -z-10 pointer-events-none" />

                     {/* Glass Card UI */}
                     <div className="relative rounded-[48px] p-8 md:p-12 glass-card-elevated">
                        <div className="flex items-center justify-between mb-10 opacity-60">
                           <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Today</span>
                           <div className="flex gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-text-muted" />
                              <div className="w-2.5 h-2.5 rounded-full bg-text-muted" />
                           </div>
                        </div>

                        {/* Stream Timeline Container */}
                        <div className="relative space-y-8">
                           {/* Continuous Vertical Line */}
                           <div className="absolute left-[5.5px] top-2 bottom-4 w-px bg-dark-border z-0" />

                           {/* Entry 1 */}
                           <div className="relative flex gap-6 z-10">
                              <div className="flex flex-col items-center gap-3 pt-1.5 shrink-0">
                                 <div className="w-3 h-3 rounded-full bg-sage border-2 border-dark-card shadow-glow" />
                              </div>
                              <div className="flex-1 pb-4">
                                 <p className="text-xs font-bold text-sage uppercase tracking-widest mb-2">9:41 AM</p>
                                 <h3 className="font-serif text-xl text-text-primary mb-2">Morning Reflection</h3>
                                 <p className="text-text-secondary font-light leading-relaxed">
                                    I realized I've been holding onto stress about the project launch. Writing it down makes it feel smaller.
                                 </p>
                              </div>
                           </div>

                           {/* Entry 2 - Text Note */}
                           <div className="relative flex gap-6 z-10">
                              <div className="flex flex-col items-center gap-3 pt-1.5 shrink-0">
                                 <div className="w-3 h-3 rounded-full bg-text-muted border-2 border-dark-card" />
                              </div>
                              <div className="flex-1 pb-4">
                                 <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">11:15 AM</p>
                                 <div className="bg-dark-surface p-4 rounded-2xl border border-dark-border">
                                    <p className="text-sm text-text-primary font-medium mb-1">Idea for the weekend</p>
                                    <p className="text-sm text-text-secondary font-light">We should go back to that hiking trail near the coast.</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="order-1 lg:order-2 reveal opacity-0 translate-y-8 transition-all duration-700 delay-200">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage-subtle text-sage text-xs font-bold uppercase tracking-widest mb-6 border border-sage-border">
                        <Feather size={14} /> The Stream
                     </div>
                     <h2 className="font-serif text-5xl md:text-6xl text-text-primary mb-6 leading-[1.1]">
                        Your mind flows.<br />
                        <span className="text-sage">So should your journal.</span>
                     </h2>
                     <p className="text-xl text-text-secondary font-light leading-relaxed mb-10 max-w-lg">
                        Forget rigid folders. Meadow captures your thoughts as a continuous stream of text, voice, and images.
                        It's messy, beautiful, and authentic—just like life.
                     </p>
                     <ul className="space-y-5 mb-10">
                        <li className="flex items-center gap-4 text-text-primary text-lg font-medium">
                           <div className="w-6 h-6 rounded-full bg-sage-subtle flex items-center justify-center text-sage border border-sage-border"><Check size={14} strokeWidth={3} /></div>
                           Beautiful timeline visualization
                        </li>
                        <li className="flex items-center gap-4 text-text-primary text-lg font-medium">
                           <div className="w-6 h-6 rounded-full bg-sage-subtle flex items-center justify-center text-sage border border-sage-border"><Check size={14} strokeWidth={3} /></div>
                           Auto-tagging and organization
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </section>

         {/* --- FEATURE 2: THREADS (3D SPATIAL UI) --- */}
         <section className="px-6 py-24 md:py-32">
            <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-24">
               <div className="reveal opacity-0 translate-y-8 transition-all duration-700 md:pr-10">
                  <div className="mb-4 flex items-center gap-3">
                     <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sage/20 text-[10px] font-bold text-sage-dark">2</span>
                     <span className="text-xs font-bold uppercase tracking-[0.15em] text-sage-dark">Threads</span>
                  </div>
                  <h2 className="mb-6 font-serif text-3xl font-normal text-text-primary md:text-5xl">Watch your thoughts connect</h2>
                  <p className="text-lg font-light leading-relaxed text-text-secondary">
                     Over time, you'll notice certain themes keep coming back.
                     Meadow gently weaves related notes together — not to analyze you,
                     but to help you see what you've been circling around.
                  </p>
               </div>

               <div className="reveal opacity-0 transition-all duration-1000 delay-200 perspective-1000 group">
                  {/* 3D Floating Card Container */}
                  <div className="relative rounded-[40px] p-8 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform md:rotate-y-12 md:group-hover:rotate-y-0 preserve-3d glass-card-elevated">

                     {/* 3D Depth Layer - Shadow simulation */}
                     <div className="absolute inset-4 rounded-[30px] shadow-card -z-10 opacity-60" />

                     {/* Ambient Shine Effect */}
                     <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-sage/0 via-sage/10 to-sage/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                     <div className="relative pl-6 preserve-3d">

                        {/* Connecting Line - Floating in 3D Space */}
                        <div className="absolute left-[11.5px] top-3 bottom-12 w-px bg-dark-border"></div>

                        {/* Note 1 - Further back */}
                        <div className="mb-10 relative pl-8">
                           <div className="absolute left-[9px] top-2 h-1.5 w-1.5 rounded-full bg-text-muted"></div>
                           <div className="opacity-50 group-hover:opacity-80 transition-opacity">
                              <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">Oct 12</p>
                              <p className="text-sm font-light text-text-secondary">"I keep taking on extra work because I'm afraid they'll think I'm not committed..."</p>
                           </div>
                        </div>

                        {/* Note 2 - Mid depth */}
                        <div className="mb-10 relative pl-8">
                           <div className="absolute left-[9px] top-2 h-1.5 w-1.5 rounded-full bg-text-muted"></div>
                           <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                              <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">Nov 03</p>
                              <p className="text-sm font-light text-text-secondary">"Said yes to leading the presentation even though I'm drowning..."</p>
                           </div>
                        </div>

                        {/* Note 3 - Active Note (Popped out most) */}
                        <div className="relative pl-8">
                           {/* Large Dot */}
                           <div className="absolute left-[7px] top-1.5 h-2.5 w-2.5 rounded-full bg-sage shadow-glow"></div>

                           {/* The Card Itself */}
                           <div className="rounded-2xl border border-dark-border bg-dark-surface p-6 shadow-xl shadow-sage/10 transition-transform duration-500 group-hover:scale-[1.02]">
                              <p className="mb-2 text-[10px] uppercase tracking-wider text-sage">Today</p>
                              <p className="text-[15px] font-normal leading-relaxed text-text-primary mb-4">"I think I'm afraid that if I set boundaries, people will see I'm not as capable as they think I am."</p>
                              <div className="inline-flex items-center gap-2 rounded-full border border-sage-border bg-sage-subtle px-3 py-1 text-[11px] font-medium text-sage">
                                 <Feather size={10} />
                                 <span>Thread: Work Boundaries</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* --- FEATURE 3: UNIFIED PREMIUM SPACES (3D/Depth Upgrades) --- */}
         <section id="spaces" className="relative py-32 px-6 bg-dark border-y border-dark-border-subtle scroll-mt-28">
            <div className="max-w-7xl mx-auto">
               <div className="text-center mb-24 reveal opacity-0 translate-y-8 transition-all duration-700">
                  <span className="text-xs font-bold text-sage uppercase tracking-[0.2em] mb-4 block">Dedicated Spaces</span>
                  <h2 className="font-serif text-5xl md:text-7xl text-text-primary mb-6">Tools for every type<br />of thinking.</h2>
                  <p className="text-text-secondary text-xl font-light max-w-2xl mx-auto">
                     Sometimes a blank page isn't enough. Meadow provides specialized tools for decisions, reflection, and future planning.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Card 1: Vault */}
                  <div className="group relative glass-card p-10 rounded-[40px] transition-all duration-500 reveal opacity-0 translate-y-8 delay-100 flex flex-col items-center text-center overflow-hidden hover:shadow-glow hover:border-sage-border">
                     {/* Inner Glow Gradient */}
                     <div className="absolute inset-0 bg-gradient-to-b from-sage/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />

                     <div className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-sage-subtle to-white text-sage flex items-center justify-center mb-8 border border-sage-200/60 group-hover:scale-110 group-hover:shadow-card-hover group-hover:border-sage-300 transition-all duration-500">
                        <Shield size={32} strokeWidth={1.5} />
                     </div>
                     <h3 className="relative z-10 font-serif text-2xl text-text-primary mb-3">The Vault</h3>
                     <p className="relative z-10 text-text-secondary leading-relaxed mb-8 font-light">
                        Send letters to your future self. Lock them away until a specific date or milestone.
                     </p>
                     <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage mt-auto bg-sage-subtle px-3 py-1 rounded-full border border-sage-border">
                        <Lock size={12} /> Encrypted & Sealed
                     </div>
                  </div>

                  {/* Card 2: Mirror */}
                  <div className="group relative glass-card p-10 rounded-[40px] transition-all duration-500 reveal opacity-0 translate-y-8 delay-200 flex flex-col items-center text-center overflow-hidden hover:shadow-card-hover hover:border-sage-border">
                     <div className="absolute inset-0 bg-gradient-to-b from-sage/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />

                     <div className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-sage-subtle to-white text-sage flex items-center justify-center mb-8 border border-sage-200/60 group-hover:scale-110 group-hover:shadow-card-hover group-hover:border-sage-300 transition-all duration-500">
                        <Eye size={32} strokeWidth={1.5} />
                     </div>
                     <h3 className="relative z-10 font-serif text-2xl text-text-primary mb-3">The Mirror</h3>
                     <p className="relative z-10 text-text-secondary leading-relaxed mb-8 font-light">
                        AI that gently reflects your patterns back to you, helping you connect the dots.
                     </p>
                     <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage mt-auto bg-sage-subtle px-3 py-1 rounded-full border border-sage-border">
                        <Activity size={12} /> Passive Analysis
                     </div>
                  </div>

                  {/* Card 3: Decision Lab */}
                  <div className="group relative glass-card p-10 rounded-[40px] transition-all duration-500 reveal opacity-0 translate-y-8 delay-300 flex flex-col items-center text-center overflow-hidden hover:shadow-card-hover hover:border-sage-border">
                     <div className="absolute inset-0 bg-gradient-to-b from-sage/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />

                     <div className="relative z-10 w-20 h-20 rounded-3xl bg-gradient-to-br from-sage-subtle to-white text-sage flex items-center justify-center mb-8 border border-sage-200/60 group-hover:scale-110 group-hover:shadow-card-hover group-hover:border-sage-300 transition-all duration-500">
                        <Scale size={32} strokeWidth={1.5} />
                     </div>
                     <h3 className="relative z-10 font-serif text-2xl text-text-primary mb-3">Decision Lab</h3>
                     <p className="relative z-10 text-text-secondary leading-relaxed mb-8 font-light">
                        A structured space to weigh pros and cons, overcome fear, and make clear choices.
                     </p>
                     <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage mt-auto bg-sage-subtle px-3 py-1 rounded-full border border-sage-border">
                        <Network size={12} /> Framework Based
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* --- HOW IT WORKS (Simple by Design) --- */}
         <section id="how-it-works" className="relative px-6 py-24 md:py-40 bg-dark-base scroll-mt-28">
            <div className="relative z-10 mx-auto max-w-4xl text-center reveal opacity-0 translate-y-8 transition-all duration-700">
               <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-sage">How it works</p>
               <h2 className="mb-6 font-serif text-3xl font-light text-text-primary md:text-5xl">Simple by design</h2>
               <p className="mx-auto mb-20 max-w-xl text-lg font-light text-text-secondary">No learning curve. No complicated setup. Just you and your thoughts.</p>

               <div className="grid gap-12 sm:grid-cols-3">
                  {[
                     { step: 1, title: 'Write anything', desc: "A decision, a feeling, a rambling thought. There's no wrong way to start." },
                     { step: 2, title: 'Notice what matters', desc: "Over time, connections and reflections surface — gently, and only when helpful." },
                     { step: 3, title: 'Understand yourself', desc: "See what you've been thinking about. Trust your own wisdom again." }
                  ].map((item) => (
                     <div key={item.step} className="group flex flex-col items-center">
                        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-dark-border bg-dark-surface font-serif text-2xl text-sage transition-all group-hover:border-sage-border group-hover:bg-sage-subtle group-hover:scale-110 group-hover:shadow-glow">
                           {item.step}
                        </div>
                        <h3 className="mb-4 font-serif text-xl text-text-primary">{item.title}</h3>
                        <p className="text-sm font-light leading-relaxed text-text-secondary">{item.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- INVITATION / FOOTER --- */}
         <section className="py-24 bg-dark border-t border-dark-border-subtle">
            <div className="max-w-3xl mx-auto px-6 text-center">
               <div className="flex justify-center mb-8 gap-2">
                  {/* MEADOW LOGO */}
                  <div className="w-12 h-12 rounded-2xl bg-sage text-white flex items-center justify-center shadow-glow">
                     <Leaf size={24} fill="currentColor" />
                  </div>
               </div>
               <h3 className="font-serif text-3xl md:text-5xl text-text-primary mb-8 leading-tight">
                  Your thoughts are worth understanding.
               </h3>
               <p className="text-xl text-text-secondary font-light mb-12 max-w-xl mx-auto">
                  Start with one note. The clarity you're looking for might be closer than you think.
               </p>
               <button
                  onClick={onEnterApp}
                  className="px-10 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-[0_4px_14px_0_rgba(107,143,122,0.39)] hover:shadow-[0_6px_20px_rgba(107,143,122,0.5)] hover:-translate-y-1 transition-all"
               >
                  Begin your journal
               </button>
            </div>
         </section>

         {/* --- FOOTER --- */}
         <footer className="bg-dark-base border-t border-dark-border py-16 px-6">
            <div className="max-w-5xl mx-auto">
               {/* Main Footer Grid */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
                  {/* Logo & Tagline */}
                  <div className="md:col-span-1">
                     <div className="flex items-center gap-2.5 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-sage text-white flex items-center justify-center shadow-glow">
                           <Leaf size={16} fill="currentColor" />
                        </div>
                        <span className="font-serif text-lg text-text-primary">Meadow</span>
                     </div>
                     <p className="text-sm text-text-tertiary leading-relaxed">
                        A digital sanctuary for clarity, growth, and self-discovery.
                     </p>
                  </div>

                  {/* Product Column */}
                  <div>
                     <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Product</h4>
                     <div className="flex flex-col gap-3">
                        <button onClick={onEnterApp} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Start Journaling</button>
                        <button onClick={() => navigateTo('/pricing')} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Pricing</button>
                        <button onClick={onLogin || onEnterApp} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Sign In</button>
                     </div>
                  </div>

                  {/* Resources Column */}
                  <div>
                     <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Resources</h4>
                     <div className="flex flex-col gap-3">
                        <button onClick={() => navigateTo('/blog')} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Blog</button>
                        <button onClick={() => navigateTo('/tools')} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Journaling Tools</button>
                     </div>
                  </div>

                  {/* Legal Column */}
                  <div>
                     <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Legal</h4>
                     <div className="flex flex-col gap-3">
                        <button onClick={() => navigateTo('/privacy')} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Privacy Policy</button>
                        <button onClick={() => navigateTo('/terms')} className="text-sm text-text-secondary hover:text-text-primary transition-colors text-left">Terms of Service</button>
                     </div>
                  </div>
               </div>

               {/* Bottom Bar */}
               <div className="border-t border-dark-border pt-8">
                  <p className="text-sm text-text-muted text-center">© 2025 Meadow Inc. All rights reserved.</p>
               </div>
            </div>
         </footer>

      </div>
   );
}

export default LandingPage;
