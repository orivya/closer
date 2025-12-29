import React, { useEffect, useState } from 'react';
import { ArrowRight, Feather, Mic, Activity, AlignLeft, Calendar, Github, X } from 'lucide-react';
import ClientView from './components/ClientView';
import Dashboard from './components/Dashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'github'>('landing');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [currentView]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Render the GitHub Client (Dev Mode)
  if (currentView === 'github') {
    return (
      <div className="flex h-screen flex-col bg-[#0d1117] text-white">
        <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-[#30363d] hover:text-white transition-colors"
            >
              <ArrowRight className="rotate-180" size={16} />
              Back to Dashboard
            </button>
            <div className="h-4 w-px bg-[#30363d]"></div>
            <span className="font-mono text-sm font-semibold text-white">Site Editor</span>
          </div>
          <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline">
            Get Access Token (Repo Scope)
          </a>
        </div>
        <div className="flex-1 overflow-hidden">
          <ClientView />
        </div>
      </div>
    );
  }

  // Render the User Dashboard (Orivya/Meadow)
  if (currentView === 'dashboard') {
    return <Dashboard onOpenDevMode={() => setCurrentView('github')} />;
  }

  // Render the Main Landing Page
  return (
    <div className="relative min-h-screen font-sans text-text-primary overflow-x-hidden selection:bg-sage-muted selection:text-white">
      
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 transition-all duration-700 md:px-12 ${
          scrolled ? 'glass-nav py-4' : 'bg-transparent py-8'
        }`}
      >
        <a href="/" className="group flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center">
            <svg viewBox="0 0 64 64" fill="none" className="h-full w-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90">
              <path d="M 38 8.5 A 24 24 0 1 1 26 8.5" stroke="#7d9b8a" strokeWidth="4" strokeLinecap="round" fill="none"/>
            </svg>
          </div>
          <span className="font-serif text-lg font-medium tracking-tight text-white opacity-0 animate-[fadeIn_1s_ease_0.5s_forwards]">Orivya</span>
        </a>

        <div className="hidden items-center gap-8 md:flex lg:gap-12">
          {['Philosophy', 'Features', 'How it works'].map((item, i) => (
            <button 
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(/\s+/g, '-'))}
              className="text-[13px] font-medium tracking-wide text-text-tertiary transition-colors hover:text-white"
              style={{ animation: `fadeIn 0.8s ease ${0.6 + i * 0.1}s forwards`, opacity: 0 }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6 opacity-0 animate-[fadeIn_0.8s_ease_1s_forwards]">
          <button 
            onClick={() => setCurrentView('dashboard')} 
            className="hidden text-[13px] font-medium text-text-tertiary transition-colors hover:text-white md:block"
          >
            Sign in
          </button>
          <button onClick={() => setCurrentView('dashboard')} className="group relative overflow-hidden rounded-lg bg-sage px-6 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-sage-dark hover:shadow-[0_0_20px_rgba(125,155,138,0.2)]">
            <span className="relative z-10">Start writing</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        {/* Subtle Glow */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 animate-pulse-slow rounded-full bg-sage-subtle opacity-20 blur-[120px]"></div>
        </div>

        <div className="relative z-10 flex max-w-4xl flex-col items-center pb-20">
          {/* Animated Logo Lens */}
          <div className="relative mb-14 h-32 w-32 md:h-40 md:w-40">
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-glow opacity-0 blur-[60px] animate-[fadeIn_2.5s_ease_0.2s_forwards]"></div>
            <svg viewBox="0 0 64 64" fill="none" className="relative z-10 h-full w-full">
              <path 
                d="M 38 8.5 A 24 24 0 1 1 26 8.5" 
                stroke="#7d9b8a" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                fill="none"
                strokeDasharray="500"
                strokeDashoffset="500"
                className="animate-draw-stroke"
              />
            </svg>
          </div>

          <h1 className="text-balance mb-8 font-serif text-5xl font-light leading-[1.05] tracking-tight text-white opacity-0 animate-[fadeInUp_1.2s_ease_1.2s_forwards] md:text-7xl lg:text-8xl">
            See yourself <em className="not-italic text-sage-light">clearly</em>.
          </h1>

          <p className="text-balance mb-14 max-w-lg text-lg font-light leading-relaxed text-text-secondary opacity-0 animate-[fadeInUp_1.2s_ease_1.4s_forwards] md:text-xl">
            A private space to think through what matters most. 
            Write freely, find clarity, and trust your own mind again.
          </p>

          <div className="flex flex-col items-center gap-4 opacity-0 animate-[fadeIn_1.2s_ease_1.6s_forwards] sm:flex-row">
            <button onClick={() => setCurrentView('dashboard')} className="flex w-full items-center justify-center gap-2 rounded-lg bg-sage px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-sage-dark hover:shadow-[0_0_30px_rgba(125,155,138,0.25)] hover:-translate-y-0.5 sm:w-auto">
              Start writing
              <ArrowRight size={16} className="opacity-80" />
            </button>
            <button onClick={() => scrollTo('philosophy')} className="w-full rounded-lg border border-border-default px-8 py-3.5 text-sm font-medium text-text-secondary transition-all hover:border-sage-muted hover:bg-white/5 hover:text-white sm:w-auto">
              Learn more
            </button>
          </div>
        </div>

        {/* Scroll Indicator - Pinned Bottom */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 opacity-0 animate-[fadeIn_1.5s_ease_2.2s_forwards]">
          <span className="text-[10px] uppercase tracking-[0.25em] text-text-muted">Scroll</span>
          <div className="relative h-12 w-[1px] bg-gradient-to-b from-border-default to-transparent">
            <div className="absolute top-0 h-1/2 w-full bg-sage animate-scroll-bounce"></div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="relative px-6 py-32 md:py-48">
        <div className="mx-auto max-w-3xl text-center reveal-on-scroll">
          <div className="mb-10 flex items-center justify-center gap-4 opacity-60">
            <div className="h-px w-8 bg-sage-muted"></div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sage">Philosophy</span>
            <div className="h-px w-8 bg-sage-muted"></div>
          </div>
          
          <h2 className="text-balance mb-10 font-serif text-3xl font-light leading-tight text-white md:text-5xl lg:text-6xl">
            You already have the answers. Sometimes you need <em className="not-italic text-sage-light">space to find them</em>.
          </h2>
          
          <p className="mx-auto max-w-xl text-lg font-light leading-relaxed text-text-secondary md:text-xl">
            Orivya is a quiet place to think — a digital sanctuary that gently helps you understand yourself, 
            without ever telling you what to feel or who to be.
          </p>
        </div>
      </section>

      {/* Feature 1: Weekly Summary */}
      <section id="features" className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="order-2 reveal-on-scroll md:order-1">
            <div className="glass-card relative overflow-hidden rounded-2xl p-6 transition-transform duration-700 hover:rotate-1 md:p-8">
              {/* Mock UI */}
              <div className="overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated/50">
                <div className="flex items-center gap-4 border-b border-border-subtle bg-bg-elevated/50 px-6 py-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-subtle text-sage">
                    <Activity size={16} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-white">Weekly Summary</span>
                  </div>
                  <span className="ml-auto text-xs font-medium text-text-tertiary">Nov 18–24</span>
                </div>
                <div className="p-8">
                  <p className="mb-8 text-sm font-light leading-relaxed text-text-secondary">
                    You made 5 entries this week. Key themes emerging:
                  </p>
                  <div className="space-y-5">
                    {[
                      { l: "Family Expectations", p: "w-[75%]" },
                      { l: "Work-Life Balance", p: "w-[50%]" },
                      { l: "Creative Energy", p: "w-[65%]" }
                    ].map((item, i) => (
                      <div key={i} className="group">
                        <div className="mb-2 flex items-center justify-between text-[13px] text-text-primary">
                          <span>{item.l}</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-bg-base/50">
                          <div className={`h-full ${item.p} rounded-full bg-sage opacity-60 transition-all duration-1000 group-hover:opacity-100`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 reveal-on-scroll md:order-2 md:pl-10">
            <div className="mb-4 flex items-center gap-3">
               <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sage-muted text-[10px] font-bold text-sage">1</span>
               <span className="text-xs font-bold uppercase tracking-[0.15em] text-sage">Reflection</span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-light text-white md:text-5xl">See what's been on your mind</h2>
            <p className="text-lg font-light leading-relaxed text-text-secondary">
              Life moves fast. It's easy to forget what you were worried about last Tuesday.
              Each week, Orivya gently reflects back what you've been thinking about — so you don't lose track of your own story.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 2: Threads */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="reveal-on-scroll md:pr-10">
            <div className="mb-4 flex items-center gap-3">
               <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sage-muted text-[10px] font-bold text-sage">2</span>
               <span className="text-xs font-bold uppercase tracking-[0.15em] text-sage">Threads</span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-light text-white md:text-5xl">Watch your thoughts connect</h2>
            <p className="text-lg font-light leading-relaxed text-text-secondary">
              Over time, you'll notice certain themes keep coming back. 
              Orivya gently weaves related notes together — not to analyze you, 
              but to help you see what you've been circling around. 
            </p>
          </div>
          
          <div className="reveal-on-scroll">
            <div className="glass-card relative rounded-2xl p-8 transition-transform duration-700 hover:scale-[1.01]">
              <div className="relative pl-6">
                {/* Connecting Line */}
                <div className="absolute left-2 top-4 bottom-12 w-[1px] bg-gradient-to-b from-sage-muted/10 via-sage-muted to-sage-muted/10"></div>
                
                <div className="mb-10 relative pl-6 group">
                  <div className="absolute -left-[3px] top-2 h-1.5 w-1.5 rounded-full bg-text-tertiary transition-colors group-hover:bg-sage"></div>
                  <div className="opacity-50 transition-opacity group-hover:opacity-80">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-text-tertiary">Oct 12</p>
                    <p className="text-sm font-light text-text-secondary">"I keep taking on extra work because I'm afraid they'll think I'm not committed..."</p>
                  </div>
                </div>
                
                <div className="mb-10 relative pl-6 group">
                  <div className="absolute -left-[3px] top-2 h-1.5 w-1.5 rounded-full bg-text-tertiary transition-colors group-hover:bg-sage"></div>
                  <div className="opacity-70 transition-opacity group-hover:opacity-100">
                    <p className="mb-1 text-[10px] uppercase tracking-wider text-text-tertiary">Nov 03</p>
                    <p className="text-sm font-light text-text-secondary">"Said yes to leading the presentation even though I'm drowning..."</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-sage shadow-[0_0_12px_rgba(125,155,138,0.6)]"></div>
                  <div className="rounded-xl border border-border-default bg-bg-elevated/60 p-6 backdrop-blur-sm">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-sage-light">Today</p>
                    <p className="text-[15px] font-normal leading-relaxed text-white mb-4">"I think I'm afraid that if I set boundaries, people will see I'm not as capable as they think I am."</p>
                    <div className="inline-flex items-center gap-2 rounded-full border border-sage-muted/30 bg-sage-subtle px-3 py-1 text-[11px] font-medium text-sage-light">
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

      {/* Feature 3: The Interface */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="order-2 reveal-on-scroll md:order-1">
             <div className="glass-card overflow-hidden rounded-2xl p-1">
                <div className="rounded-xl bg-bg-base/80 p-6 md:p-10">
                   <div className="mb-8 flex items-center justify-between border-b border-border-subtle pb-6">
                     <div className="space-y-1">
                       <h3 className="font-serif text-2xl text-white">Sunday Evening</h3>
                       <div className="flex items-center gap-3 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1"><Calendar size={12}/> Nov 24</span>
                          <span className="flex items-center gap-1"><AlignLeft size={12}/> Personal</span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="space-y-6 text-[16px] font-light leading-relaxed text-text-secondary">
                     <p>I've been thinking about what I actually want from this next chapter. Not what I think I should want, or what would look impressive, but what would actually make me feel alive.</p>
                     <p className="pl-4 border-l border-sage-muted/50 text-text-primary italic">"Maybe it's not about figuring it out in advance — maybe it's about giving myself permission to try things."</p>
                     <p>I keep waiting for certainty, but what if it never comes?</p>
                   </div>
  
                   <div className="mt-10 flex flex-wrap gap-2">
                       {['permission', 'uncertainty', 'self-trust'].map(tag => (
                         <span key={tag} className="rounded-md bg-bg-surface border border-border-subtle px-2 py-1 text-[11px] text-text-secondary hover:text-white transition-colors cursor-default">#{tag}</span>
                       ))}
                   </div>
                </div>
             </div>
          </div>
          
          <div className="order-1 reveal-on-scroll md:order-2 md:pl-10">
            <div className="mb-4 flex items-center gap-3">
               <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sage-muted text-[10px] font-bold text-sage">3</span>
               <span className="text-xs font-bold uppercase tracking-[0.15em] text-sage">Interface</span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-light text-white md:text-5xl">A clean space to think</h2>
            <p className="text-lg font-light leading-relaxed text-text-secondary">
              No clutter. No distractions. Just a simple place to write whatever's on your mind. 
              See related threads, key concepts, and how your thinking evolves — 
              all without losing the simplicity of a blank page.
            </p>
          </div>
        </div>
      </section>

      {/* Feature 4: Voice */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2 md:gap-24">
          <div className="reveal-on-scroll md:pr-10">
            <div className="mb-4 flex items-center gap-3">
               <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sage-muted text-[10px] font-bold text-sage">4</span>
               <span className="text-xs font-bold uppercase tracking-[0.15em] text-sage">Voice Notes</span>
            </div>
            <h2 className="mb-6 font-serif text-3xl font-light text-white md:text-5xl">Speak when words are easier said</h2>
            <p className="text-lg font-light leading-relaxed text-text-secondary">
              Sometimes you need to think out loud. Record your thoughts 
              and Orivya will capture them, so nothing gets lost in the 
              moment. Perfect for when you're driving, walking, or just 
              need to let it flow without typing.
            </p>
          </div>
          
          <div className="reveal-on-scroll">
            <div className="glass-card rounded-2xl p-8 transition-transform hover:-translate-y-1">
                {/* Visualizer */}
                <div className="mb-8 flex items-center justify-center gap-1.5 h-12 opacity-80">
                   {[4, 8, 3, 7, 5, 9, 6, 4, 8, 5, 3, 7, 4, 6, 9, 5, 8, 4, 3, 5, 7, 4].map((h, i) => (
                     <div 
                       key={i} 
                       className="w-1 rounded-full bg-sage" 
                       style={{ 
                         height: `${h * 4}px`, 
                         opacity: Math.max(0.3, i % 2 === 0 ? 0.9 : 0.5),
                         animation: `pulse 1.5s ease-in-out infinite ${i * 0.05}s`
                       }}
                     ></div>
                   ))}
                </div>

                <div className="mb-8 pl-4 border-l-2 border-sage-muted/30">
                   <p className="text-[15px] font-light italic leading-relaxed text-text-secondary">
                    "Sitting in the parking lot... realized I've been on autopilot. 
                    I haven't asked myself what I want in... I don't know how long. 
                    <span className="text-white not-italic font-normal">When did I stop checking in?</span>"
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-subtle text-sage">
                       <Mic size={10} />
                    </div>
                    <span>Recorded yesterday</span>
                  </div>
                  <span className="text-xs font-mono text-text-tertiary">02:34</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative px-6 py-24 md:py-40">
         <div className="absolute inset-0 bg-gradient-surface pointer-events-none"></div>
        <div className="relative z-10 mx-auto max-w-4xl text-center reveal-on-scroll">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-sage">How it works</p>
          <h2 className="mb-6 font-serif text-3xl font-light text-white md:text-5xl">Simple by design</h2>
          <p className="mx-auto mb-20 max-w-xl text-lg font-light text-text-secondary">No learning curve. No complicated setup. Just you and your thoughts.</p>
          
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              { step: 1, title: 'Write anything', desc: "A decision, a feeling, a rambling thought. There's no wrong way to start." },
              { step: 2, title: 'Notice what matters', desc: "Over time, connections and reflections surface — gently, and only when helpful." },
              { step: 3, title: 'Understand yourself', desc: "See what you've been thinking about. Trust your own wisdom again." }
            ].map((item) => (
              <div key={item.step} className="group flex flex-col items-center">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-border-default bg-bg-surface font-serif text-2xl text-sage shadow-lg transition-colors group-hover:border-sage-muted group-hover:bg-bg-elevated">
                  {item.step}
                </div>
                <h3 className="mb-4 font-serif text-xl text-white">{item.title}</h3>
                <p className="text-sm font-light leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="px-6 py-24 md:py-40">
        <div className="mx-auto max-w-5xl">
          <div className="mb-20 text-center reveal-on-scroll">
            <h2 className="mb-6 font-serif text-3xl font-light text-white md:text-5xl">Not another productivity tool</h2>
            <p className="mx-auto max-w-xl text-lg font-light text-text-secondary">Most apps want to optimize you. Orivya just wants to help you understand yourself.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              { title: 'Private by design', desc: "Your notes are encrypted. We can't read them, and we never will. This is your space — not our data." },
              { title: 'No streaks, no guilt', desc: "Write when you want to. Skip a week. Come back when you're ready. Orivya doesn't shame you for living your life." },
              { title: 'No metrics to chase', desc: "No word counts. No mood charts. No gamification. Just a clean space to think." },
              { title: 'AI that knows its place', desc: "Every intelligent feature is optional. You're in control of how much — or how little — help you want." }
            ].map((item, i) => (
              <div key={i} className="reveal-on-scroll rounded-2xl border border-border-subtle bg-bg-elevated/30 p-10 transition-colors hover:bg-bg-elevated/60 hover:border-border-default">
                <h3 className="mb-4 font-serif text-xl text-text-primary">{item.title}</h3>
                <p className="text-[15px] font-light leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-32 text-center md:py-48">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-subtle opacity-10 blur-[100px]"></div>
        
        <div className="relative z-10 mx-auto max-w-2xl reveal-on-scroll">
          <div className="mx-auto mb-12 h-24 w-24 opacity-80">
             <svg viewBox="0 0 64 64" fill="none">
               <path d="M 38 8.5 A 24 24 0 1 1 26 8.5" stroke="#7d9b8a" strokeWidth="2" strokeLinecap="round" fill="none"/>
             </svg>
          </div>
          <h2 className="mb-8 font-serif text-4xl font-light leading-tight text-white md:text-6xl">
            Your thoughts are <em className="not-italic text-sage-light">worth understanding</em>.
          </h2>
          <p className="mb-12 text-lg font-light text-text-secondary">
            Start with one note. Just get something out of your head. 
            The clarity you're looking for might be closer than you think.
          </p>
          <button onClick={() => setCurrentView('dashboard')} className="inline-block rounded-lg bg-sage px-10 py-4 text-sm font-semibold tracking-wide text-white transition-all hover:bg-sage-dark hover:shadow-[0_0_40px_rgba(125,155,138,0.2)] hover:-translate-y-1">
            Start writing for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-bg-base px-6 py-12 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="flex items-center gap-2 opacity-60 transition-opacity hover:opacity-100">
             <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6">
               <path d="M 38 8.5 A 24 24 0 1 1 26 8.5" stroke="#7d9b8a" strokeWidth="4" strokeLinecap="round" fill="none"/>
             </svg>
             <span className="font-serif text-base font-medium text-text-primary">Orivya</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-[13px] text-text-tertiary">
            {['Privacy', 'Terms', 'Pricing', 'Support'].map(link => (
              <a key={link} href="#" className="transition-colors hover:text-white">{link}</a>
            ))}
            {/* Added GitHub Editor Link */}
            <button onClick={() => setCurrentView('editor')} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Github size={12} />
              <span>Site Editor</span>
            </button>
          </div>
          
          <p className="text-[11px] text-text-muted">© 2025 Orivya Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}