import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-[var(--bg-base)] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
            
          <div className="relative order-2 md:order-1">
             <div className="absolute -inset-4 bg-gradient-to-r from-[var(--accent)] to-purple-900 opacity-20 blur-3xl rounded-full"></div>
             <div className="relative rounded-2xl overflow-hidden border border-[var(--border-dark)]">
                 <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=1000&fit=crop" 
                  alt="Studio" 
                  className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tight">The Engineer<br/>Behind The Sound</h2>
            
            <div className="space-y-8 text-[var(--text-gray)] text-lg md:text-xl font-light leading-relaxed">
              <p>
                My name is James. For over a decade, I've been obsessively refining the art of mixing. This isn't just about technical precision—it's about emotion, impact, and translation.
              </p>
              <p>
                I operate out of a tuned facility in Los Angeles, designed specifically for the depth and punch of modern R&B and Hip-Hop. When you work with me, you aren't uploading files to a machine; you're collaborating with a partner invested in your vision.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-[var(--border-dark)]">
              <div>
                <div className="text-4xl font-bold text-white mb-1">10+</div>
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">Years</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">LA</div>
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">Base</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">50M</div>
                <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-widest">Streams</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};