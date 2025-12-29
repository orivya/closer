import React from 'react';
import { ArrowDown, Play } from 'lucide-react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-30" 
             style={{ background: 'radial-gradient(circle at 50% 30%, var(--accent-subtle) 0%, transparent 50%)' }} />
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 relative"
          >
            {/* Image Glow */}
            <div className="absolute -inset-4 bg-[var(--accent)] opacity-20 blur-2xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces" 
              alt="James Mix" 
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border border-white/10 shadow-2xl"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
              Sonic
              <span className="text-[var(--accent)]">.</span>
              <br />
              <span className="text-[var(--text-gray)]">Identity</span>
              <span className="text-[var(--accent)]">.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--text-gray)] leading-relaxed max-w-2xl mx-auto mb-12 font-light">
              I help independent artists and labels craft a signature sound that cuts through the noise. Precision mixing and mastering for the modern era.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white text-[var(--bg-base)] font-bold rounded-full hover:scale-105 transition-transform duration-300">
                View Services
              </a>
              <a href="#demo" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-full hover:bg-white/10 flex items-center justify-center gap-2 transition-all duration-300 group">
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                Listen to Work
              </a>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 1, delay: 1 }}
             className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[var(--text-muted)] to-transparent"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};