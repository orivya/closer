import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { SERVICES } from '../constants';

interface ServicesProps {
  onServiceSelect?: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onServiceSelect }) => {
  return (
    <section id="services" className="py-32 bg-[var(--bg-base)]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Select Your<br/>Session</h2>
          </div>
          <p className="text-[var(--text-gray)] max-w-sm text-lg leading-relaxed">
            Professional audio engineering packages tailored to your project's needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map((service, idx) => (
            <div key={service.id} className="group relative bg-[var(--bg-card)] border border-[var(--border-dark)] rounded-3xl p-10 hover:border-[var(--accent)] transition-all duration-500">
              <div className="absolute top-10 right-10 opacity-20 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all duration-500 transform group-hover:scale-110 group-hover:-rotate-12">
                <service.icon className="w-12 h-12" />
              </div>

              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-[var(--accent)] font-medium text-lg">{service.price}</p>
                </div>

                <p className="text-[var(--text-gray)] leading-relaxed mb-10">
                  {service.description}
                </p>

                <ul className="space-y-4 mb-10 flex-grow">
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm text-[var(--text-gray)]">
                      <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={onServiceSelect}
                  className="w-full py-4 rounded-xl border border-[var(--border-dark)] text-white font-semibold hover:bg-white hover:text-[var(--bg-base)] transition-all duration-300"
                >
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};