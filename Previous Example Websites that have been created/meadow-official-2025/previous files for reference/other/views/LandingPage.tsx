
import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowRight, Feather, Mic, Activity, Calendar, 
  Leaf, Play, Lock, Sparkles, Scale, Network, Archive, 
  Check, GitBranch, Shield, Eye, FileText, Image as ImageIcon,
  Mouse
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onDemoLogin?: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onDemoLogin }) => {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (heroRef.current) {
        const scrolled = window.scrollY;
        // Parallax fade effect for hero
        heroRef.current.style.transform = `translateY(${scrolled * 0.15}px)`;
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
    <div className="relative font-sans text-text-primary bg-[#faf9f7] overflow-hidden selection:bg-sage/20 selection:text-sage-dark">
      
      {/* --- CINEMATIC GRAIN OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-multiply" 
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
        
        {/* Navigation */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-4' : 'py-8'}`}>
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
               <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center shadow-lg shadow-sage/20">
                  <Leaf size={16} fill="currentColor" />
               </div>
               <span className="font-serif text-xl font-medium text-text-primary tracking-tight">Meadow</span>
            </div>
            
            <div className="flex items-center gap-6">
               <button 
                 onClick={onDemoLogin || onEnterApp} 
                 className="hidden md:block text-sm font-bold uppercase tracking-wide text-sage-dark hover:text-sage transition-colors"
               >
                 Demo
               </button>
               
               <div className="hidden md:block w-px h-4 bg-stone-300/50" />

               <button onClick={onEnterApp} className="hidden md:block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Log In</button>
               <button onClick={onEnterApp} className="bg-text-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Start Journaling
               </button>
            </div>
          </div>
        </nav>

        {/* Hero Content & Visuals */}
        <div ref={heroRef} className="max-w-4xl mx-auto px-6 text-center z-10 relative mt-8">
           
           {/* FLOATING CONTENT CARDS - SYMMETRICAL & WIDER SPREAD */}
           {/* Changed bottom to -24 and left/right to -48 to push them away from the center text */}
           
           {/* Bottom Left - Universal Note */}
           <div className="absolute -bottom-24 -left-12 lg:-left-48 hidden md:block animate-float-slow" style={{ zIndex: 20 }}>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-60 text-left transform hover:scale-105 transition-transform duration-300">
                 <div className="flex gap-2 items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center text-sage"><FileText size={12} /></div>
                    <span className="text-[10px] font-bold text-sage uppercase tracking-wider">Note</span>
                 </div>
                 <div className="space-y-1">
                    <p className="font-serif text-xs text-text-primary leading-relaxed">"I'm learning to trust the pace of my own life."</p>
                 </div>
              </div>
           </div>

            {/* Bottom Right - Connecting */}
            <div className="absolute -bottom-24 -right-12 lg:-right-48 hidden md:block animate-float-delayed" style={{ zIndex: 20 }}>
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 w-60 text-left transform hover:scale-105 transition-transform duration-300">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center text-sage"><GitBranch size={12} /></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage">Connecting...</span>
                 </div>
                 <div className="pl-3 border-l-2 border-sage/20">
                    <p className="text-xs text-text-secondary leading-relaxed">"This connects to your entry about <span className="text-text-primary font-medium">Patience</span>."</p>
                 </div>
              </div>
           </div>


           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-sage/20 text-sage-dark text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in shadow-sm relative z-10">
            <Sparkles size={12} /> A sanctuary for your mind
           </div>
          
           {/* Tighter spacing: Reduced mb and pb */}
           <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] text-text-primary mb-5 tracking-tight opacity-0 animate-fade-up relative z-10" style={{ animationDelay: '0.2s' }}>
              See yourself <br />
              {/* Added pb-4 to fix clipped 'y' */}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-sage-dark to-sage pb-4">
                clearly.
              </span>
           </h1>

           <p className="text-xl text-text-secondary font-light max-w-lg mx-auto mb-12 opacity-0 animate-fade-up leading-relaxed relative z-10" style={{ animationDelay: '0.4s' }}>
              Meadow isn't just a place to write notes—it's a mirror that reflects your growth, patterns, and clarity back to you.
           </p>

           <div className="flex flex-col items-center justify-center gap-12 opacity-0 animate-fade-up relative z-10" style={{ animationDelay: '0.6s' }}>
              <button 
                onClick={onEnterApp}
                className="group relative px-10 py-4 bg-text-primary text-white rounded-full text-lg font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">Start your journal <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></span>
              </button>
           </div>
        </div>

        {/* Gradient Fade to Next Section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#faf9f7] to-transparent pointer-events-none" />
      </div>


      {/* --- FEATURE 1: THE STREAM --- */}
      <section className="relative py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div className="order-2 lg:order-1 relative reveal opacity-0 translate-y-8 transition-all duration-700">
                  {/* Decorative Background Blob - REDUCED OPACITY to fix glitching/tinting */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-sage/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
                  
                  {/* Glass Card UI - Increased opacity to 95% to allow less bleed-through */}
                  <div className="relative rounded-[48px] p-8 md:p-12 shadow-2xl border border-white bg-white/95 backdrop-blur-xl">
                     <div className="flex items-center justify-between mb-10 opacity-60">
                         <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Today</span>
                         <div className="flex gap-1.5">
                             <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                             <div className="w-2.5 h-2.5 rounded-full bg-stone-300" />
                         </div>
                     </div>
                     
                     {/* Stream Timeline Container */}
                     <div className="relative space-y-8">
                        {/* Continuous Vertical Line - Aligned to center of 12px dots (6px) */}
                        <div className="absolute left-[6px] top-2 bottom-4 w-px bg-stone-200 z-0" />

                        {/* Entry 1 */}
                        <div className="relative flex gap-6 z-10">
                           <div className="flex flex-col items-center gap-3 pt-1.5 shrink-0">
                              <div className="w-3 h-3 rounded-full bg-sage ring-4 ring-white" />
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
                              <div className="w-3 h-3 rounded-full bg-stone-300 ring-4 ring-white" />
                           </div>
                           <div className="flex-1 pb-4">
                              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">11:15 AM</p>
                              <div className="bg-[#faf9f7] p-4 rounded-2xl border border-stone-100">
                                 <p className="text-sm text-text-primary font-medium mb-1">Idea for the weekend</p>
                                 <p className="text-sm text-text-secondary font-light">We should go back to that hiking trail near the coast.</p>
                              </div>
                           </div>
                        </div>

                        {/* Entry 3 - Voice Note (Neutral & Filled Out) */}
                        <div className="relative flex gap-6 z-10">
                           <div className="flex flex-col items-center gap-3 pt-1.5 shrink-0">
                              <div className="w-3 h-3 rounded-full bg-stone-400 ring-4 ring-white" />
                           </div>
                           <div className="flex-1 pb-4">
                              <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-2">Voice Note · 2:15</p>
                              <div className="bg-white p-5 rounded-2xl flex items-center gap-4 border border-stone-100 shadow-sm">
                                 <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 shrink-0">
                                    <Play size={14} fill="currentColor" />
                                 </div>
                                 <div className="flex gap-1 h-8 items-center flex-1 justify-between px-1">
                                    {[3,6,4,8,5,9,3,5,7,4,2,6,4,7,3,5,4,8,5,3,6,4,7,5].map((h,i) => (
                                       <div key={i} className="w-1 bg-stone-400 rounded-full" style={{ height: `${h*4}%`, opacity: 0.5 + (i/40) }} />
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="order-1 lg:order-2 reveal opacity-0 translate-y-8 transition-all duration-700 delay-200">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sage/10 text-sage-dark text-xs font-bold uppercase tracking-widest mb-6">
                     <Feather size={14} /> The Stream
                  </div>
                  <h2 className="font-serif text-5xl md:text-6xl text-text-primary mb-6 leading-[1.1]">
                     Your mind flows.<br/>
                     <span className="text-sage">So should your journal.</span>
                  </h2>
                  <p className="text-xl text-text-secondary font-light leading-relaxed mb-10 max-w-lg">
                     Forget rigid folders. Meadow captures your thoughts as a continuous stream of text, voice, and images. 
                     It's messy, beautiful, and authentic—just like life.
                  </p>
                  <ul className="space-y-5 mb-10">
                     <li className="flex items-center gap-4 text-text-primary text-lg font-medium">
                        <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center text-sage"><Check size={14} strokeWidth={3} /></div> 
                        Unlimited voice transcriptions
                     </li>
                     <li className="flex items-center gap-4 text-text-primary text-lg font-medium">
                        <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center text-sage"><Check size={14} strokeWidth={3} /></div> 
                        Beautiful timeline visualization
                     </li>
                     <li className="flex items-center gap-4 text-text-primary text-lg font-medium">
                        <div className="w-6 h-6 rounded-full bg-sage/10 flex items-center justify-center text-sage"><Check size={14} strokeWidth={3} /></div> 
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
            <div className="relative rounded-[40px] p-8 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform md:rotate-y-12 rotate-x-6 md:group-hover:rotate-y-0 group-hover:rotate-x-0 preserve-3d shadow-2xl bg-white/90 backdrop-blur-xl border border-white/60">
               
               {/* 3D Depth Layer - Shadow simulation */}
               <div className="absolute inset-4 rounded-[30px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] -z-10 transition-all duration-700 transform translate-z-[-20px]" />
               
               {/* Ambient Shine Effect */}
               <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative pl-6 preserve-3d">
                
                {/* Connecting Line - Floating in 3D Space */}
                <div className="absolute left-[11.5px] top-3 bottom-12 w-px bg-stone-300 transition-transform duration-700" style={{ transform: 'translateZ(10px)' }}></div>
                
                {/* Note 1 - Further back */}
                <div className="mb-10 relative pl-8 transition-transform duration-700" style={{ transform: 'translateZ(20px)' }}>
                  <div className="absolute left-[9px] top-2 h-1.5 w-1.5 rounded-full bg-stone-300 outline outline-4 outline-white"></div>
                  <div className="opacity-50 group-hover:opacity-80 transition-opacity">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">Oct 12</p>
                    <p className="text-sm font-light text-text-secondary">"I keep taking on extra work because I'm afraid they'll think I'm not committed..."</p>
                  </div>
                </div>
                
                {/* Note 2 - Mid depth */}
                <div className="mb-10 relative pl-8 transition-transform duration-700" style={{ transform: 'translateZ(30px)' }}>
                  <div className="absolute left-[9px] top-2 h-1.5 w-1.5 rounded-full bg-stone-300 outline outline-4 outline-white"></div>
                  <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-text-muted">Nov 03</p>
                    <p className="text-sm font-light text-text-secondary">"Said yes to leading the presentation even though I'm drowning..."</p>
                  </div>
                </div>

                {/* Note 3 - Active Note (Popped out most) */}
                <div className="relative pl-8 transition-transform duration-700" style={{ transform: 'translateZ(50px)' }}>
                  {/* Large Dot */}
                  <div className="absolute left-[7px] top-1.5 h-2.5 w-2.5 rounded-full bg-sage shadow-[0_0_12px_rgba(125,155,138,0.6)] outline outline-4 outline-white"></div>
                  
                  {/* The Card Itself */}
                  <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xl shadow-sage/5 transition-transform duration-500 group-hover:scale-[1.02]">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-sage-dark">Today</p>
                    <p className="text-[15px] font-normal leading-relaxed text-text-primary mb-4">"I think I'm afraid that if I set boundaries, people will see I'm not as capable as they think I am."</p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sage/20 bg-sage/5 px-3 py-1 text-[11px] font-medium text-sage-dark">
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
      <section className="relative py-32 px-6 bg-white border-y border-stone-200">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 reveal opacity-0 translate-y-8 transition-all duration-700">
               <span className="text-xs font-bold text-sage-dark uppercase tracking-[0.2em] mb-4 block">Dedicated Spaces</span>
               <h2 className="font-serif text-5xl md:text-7xl text-text-primary mb-6">Tools for every type<br/>of thinking.</h2>
               <p className="text-text-secondary text-xl font-light max-w-2xl mx-auto">
                  Sometimes a blank page isn't enough. Meadow provides specialized tools for decisions, reflection, and future planning.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
               {/* Card 1: Vault - Premium Depth (Unified Sage) */}
               <div className="group relative bg-[#faf9f7] p-10 rounded-[40px] premium-card-shadow premium-card-hover transition-all duration-500 reveal opacity-0 translate-y-8 delay-100 flex flex-col items-center text-center overflow-hidden">
                  {/* Inner Glow Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent opacity-50 pointer-events-none" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-3xl bg-white text-text-secondary flex items-center justify-center mb-8 shadow-lg shadow-stone-200/50 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 border border-stone-100">
                     <Shield size={32} strokeWidth={1.5} className="text-sage group-hover:text-sage-dark transition-colors" />
                  </div>
                  <h3 className="relative z-10 font-serif text-2xl text-text-primary mb-3">The Vault</h3>
                  <p className="relative z-10 text-text-secondary leading-relaxed mb-8 font-light">
                     Send letters to your future self. Lock them away until a specific date or milestone.
                  </p>
                  <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage-dark mt-auto bg-sage/10 px-3 py-1 rounded-full">
                     <Lock size={12} /> Encrypted & Sealed
                  </div>
               </div>

               {/* Card 2: Mirror - Premium Depth (Unified Sage) */}
               <div className="group relative bg-[#faf9f7] p-10 rounded-[40px] premium-card-shadow premium-card-hover transition-all duration-500 reveal opacity-0 translate-y-8 delay-200 flex flex-col items-center text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent opacity-50 pointer-events-none" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-3xl bg-white text-text-secondary flex items-center justify-center mb-8 shadow-lg shadow-stone-200/50 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 border border-stone-100">
                     <Eye size={32} strokeWidth={1.5} className="text-sage group-hover:text-sage-dark transition-colors" />
                  </div>
                  <h3 className="relative z-10 font-serif text-2xl text-text-primary mb-3">The Mirror</h3>
                  <p className="relative z-10 text-text-secondary leading-relaxed mb-8 font-light">
                     AI that gently reflects your patterns back to you, helping you connect the dots.
                  </p>
                  <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage-dark mt-auto bg-sage/10 px-3 py-1 rounded-full">
                     <Activity size={12} /> Passive Analysis
                  </div>
               </div>

               {/* Card 3: Decision Lab - Premium Depth (Unified Sage) */}
               <div className="group relative bg-[#faf9f7] p-10 rounded-[40px] premium-card-shadow premium-card-hover transition-all duration-500 reveal opacity-0 translate-y-8 delay-300 flex flex-col items-center text-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent opacity-50 pointer-events-none" />
                  
                  <div className="relative z-10 w-20 h-20 rounded-3xl bg-white text-text-secondary flex items-center justify-center mb-8 shadow-lg shadow-stone-200/50 group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 border border-stone-100">
                     <Scale size={32} strokeWidth={1.5} className="text-sage group-hover:text-sage-dark transition-colors" />
                  </div>
                  <h3 className="relative z-10 font-serif text-2xl text-text-primary mb-3">Decision Lab</h3>
                  <p className="relative z-10 text-text-secondary leading-relaxed mb-8 font-light">
                     A structured space to weigh pros and cons, overcome fear, and make clear choices.
                  </p>
                  <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sage-dark mt-auto bg-sage/10 px-3 py-1 rounded-full">
                     <Network size={12} /> Framework Based
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FEATURE 4: VOICE NOTES (CLEAN STATIC VISUALIZER) --- */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="reveal opacity-0 translate-y-8 transition-all duration-700 md:pr-10">
            <div className="mb-4 flex items-center gap-3">
               <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sage/20 text-[10px] font-bold text-sage-dark">3</span>
               <span className="text-xs font-bold uppercase tracking-[0.15em] text-sage-dark">Voice Notes</span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-normal text-text-primary md:text-5xl">Speak when words are easier said</h2>
            <p className="text-lg font-light leading-relaxed text-text-secondary">
              Sometimes you need to think out loud. Record your thoughts 
              and Meadow will capture them, so nothing gets lost in the 
              moment. Perfect for when you're driving, walking, or just 
              need to let it flow without typing.
            </p>
          </div>
          
          <div className="reveal opacity-0 translate-y-8 transition-all duration-700 delay-200">
            <div className="glass-card rounded-[40px] p-8 transition-transform duration-700 hover:-rotate-1 relative overflow-hidden">
                {/* Visualizer - Clean & Visible */}
                <div className="mb-8 flex items-center justify-center gap-1.5 h-12">
                   {[4, 8, 3, 7, 5, 9, 6, 4, 8, 5, 3, 7, 4, 6, 9, 5, 8, 4, 3, 5, 7, 4].map((h, i) => (
                     <div 
                       key={i} 
                       className="w-1.5 rounded-full bg-sage" 
                       style={{ 
                         height: `${h * 5}%`, // Relative percentage height
                         opacity: 0.6 + (i % 3) * 0.1, // Subtle opacity variation
                       }}
                     ></div>
                   ))}
                </div>

                <div className="mb-8 pl-4 border-l-2 border-sage/30">
                   <p className="text-[15px] font-light italic leading-relaxed text-text-secondary">
                    "Sitting in the parking lot... realized I've been on autopilot. 
                    I haven't asked myself what I want in... I don't know how long. 
                    <span className="text-text-primary not-italic font-normal">When did I stop checking in?</span>"
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-stone-200/50 pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage/10 text-sage">
                       <Mic size={10} />
                    </div>
                    <span>Recorded yesterday</span>
                  </div>
                  <span className="text-xs font-mono text-text-muted">02:34</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Simple by Design) --- */}
      <section id="how-it-works" className="relative px-6 py-24 md:py-40 bg-white">
        <div className="relative z-10 mx-auto max-w-4xl text-center reveal opacity-0 translate-y-8 transition-all duration-700">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-sage-dark">How it works</p>
          <h2 className="mb-6 font-serif text-3xl font-light text-text-primary md:text-5xl">Simple by design</h2>
          <p className="mx-auto mb-20 max-w-xl text-lg font-light text-text-secondary">No learning curve. No complicated setup. Just you and your thoughts.</p>
          
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              { step: 1, title: 'Write anything', desc: "A decision, a feeling, a rambling thought. There's no wrong way to start." },
              { step: 2, title: 'Notice what matters', desc: "Over time, connections and reflections surface — gently, and only when helpful." },
              { step: 3, title: 'Understand yourself', desc: "See what you've been thinking about. Trust your own wisdom again." }
            ].map((item) => (
              <div key={item.step} className="group flex flex-col items-center">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-stone-200 bg-stone-50 font-serif text-2xl text-sage transition-all group-hover:border-sage/30 group-hover:bg-sage/5 group-hover:scale-110">
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
      <section className="py-24 bg-[#f5f3f0]/50 border-t border-stone-200">
         <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-8 gap-2">
               {/* MEADOW LOGO */}
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center shadow-lg shadow-sage/20">
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
              className="px-10 py-4 bg-text-primary text-white rounded-full text-lg font-medium shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
               Begin your journal
            </button>
         </div>
      </section>

      {/* --- FOOTER LINKS --- */}
      <footer className="bg-white border-t border-stone-200 pt-24 pb-12 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
               <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center">
                        <Leaf size={20} fill="currentColor" />
                     </div>
                     <span className="font-serif text-2xl text-text-primary">Meadow</span>
                  </div>
                  <p className="max-w-sm text-lg text-text-secondary font-light leading-relaxed">
                     A digital sanctuary for clarity, growth, and self-discovery. Built for those who want to understand their own story.
                  </p>
               </div>
               
               <div>
                  <h4 className="font-bold text-text-primary mb-6">Product</h4>
                  <ul className="space-y-4 text-text-secondary">
                     <li><button onClick={onEnterApp} className="hover:text-sage transition-colors">The Stream</button></li>
                     <li><button onClick={onEnterApp} className="hover:text-sage transition-colors">Spaces</button></li>
                     <li><button onClick={onEnterApp} className="hover:text-sage transition-colors">Pricing</button></li>
                     <li><button onClick={onEnterApp} className="hover:text-sage transition-colors">Manifesto</button></li>
                  </ul>
               </div>
               
               <div>
                  <h4 className="font-bold text-text-primary mb-6">Company</h4>
                  <ul className="space-y-4 text-text-secondary">
                     <li><button className="hover:text-sage transition-colors">About Us</button></li>
                     <li><button className="hover:text-sage transition-colors">Blog</button></li>
                     <li><button className="hover:text-sage transition-colors">Careers</button></li>
                     <li><button className="hover:text-sage transition-colors">Contact</button></li>
                  </ul>
               </div>
            </div>
            
            <div className="border-t border-stone-100 pt-12 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted">
               <p>© 2025 Meadow Inc. All rights reserved.</p>
               <div className="flex gap-8 mt-4 md:mt-0">
                  <button className="hover:text-text-primary transition-colors">Privacy Policy</button>
                  <button className="hover:text-text-primary transition-colors">Terms of Service</button>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}

export default LandingPage;
