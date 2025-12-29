import React from 'react';
import { Mail } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  return (
    <section id="contact" className="py-32 relative overflow-hidden text-center bg-[var(--bg-base)]">
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">Let's make <br/>something timeless.</h2>
        <p className="text-xl text-[var(--text-gray)] mb-12 max-w-lg mx-auto font-light">
           Your music deserves a professional touch. Reach out to discuss your project.
        </p>
        
        <a href="mailto:contact@jamesmix.com" className="inline-block px-10 py-5 bg-white text-[var(--bg-base)] font-bold rounded-full hover:scale-105 transition-all duration-300">
          Get in Touch
        </a>
      </div>
    </section>
  );
};