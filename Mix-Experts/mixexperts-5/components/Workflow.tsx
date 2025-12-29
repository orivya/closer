import React from 'react';
import { UploadCloud, Sliders, Headphones, Zap } from 'lucide-react';

export const Workflow: React.FC = () => {
  const steps = [
    {
      icon: UploadCloud,
      title: "Secure Upload",
      desc: "Drag & drop your stems into your private client portal."
    },
    {
      icon: Sliders,
      title: "Precision Mix",
      desc: "I balance, EQ, and compress to shape your sonic identity."
    },
    {
      icon: Headphones,
      title: "Reference Check",
      desc: "You review the mix in high-fidelity and request tweaks."
    },
    {
      icon: Zap,
      title: "Master Delivery",
      desc: "Final polished masters delivered in all streaming formats."
    }
  ];

  return (
    <section className="py-32 bg-[var(--bg-base)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-20 text-center">The Workflow</h2>
        
        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--border-dark)] to-transparent" />
          
          <div className="grid md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-dark)] flex items-center justify-center mb-8 group-hover:border-[var(--accent)] group-hover:bg-[var(--bg-card)] transition-all duration-500 relative">
                  <step.icon className="w-8 h-8 text-[var(--text-gray)] group-hover:text-[var(--accent)] transition-colors" />
                  <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-[var(--bg-base)] border border-[var(--border-dark)] text-xs font-bold text-[var(--text-muted)]">
                    0{idx + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[var(--text-gray)] text-sm leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};