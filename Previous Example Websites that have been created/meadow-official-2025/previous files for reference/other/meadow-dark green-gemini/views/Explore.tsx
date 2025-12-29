import React, { useState } from 'react';
import { Compass, Star, Heart, Target, Wind, Lock, Sparkles, Scale, Archive, ArrowRight, Play } from 'lucide-react';
import { GlassCard, Button } from '../components/ui';

interface ExploreProps {
  onNavigate: (view: any) => void;
}

export const Explore: React.FC<ExploreProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'journeys' | 'toolbox'>('journeys');

  const journeys = [
    { id: 'clarity', title: '7 Days of Clarity', desc: 'Cut through mental noise and reconnect with what matters most.', days: 7, icon: Star, featured: true, color: 'bg-sage-100 text-sage-600' },
    { id: 'gratitude', title: 'Gratitude Practice', desc: 'Shift your perspective from lack to abundance.', days: 7, icon: Heart, color: 'bg-orange-50 text-orange-500' },
    { id: 'letting-go', title: 'Letting Go', desc: 'Release what is holding you back to make space.', days: 5, icon: Wind, color: 'bg-blue-50 text-blue-500' },
    { id: 'purpose', title: 'Finding Purpose', desc: 'Align your daily actions with your deeper direction.', days: 10, icon: Compass, color: 'bg-purple-50 text-purple-500' },
  ];

  return (
    <div className="animate-fade-up max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="font-serif text-4xl text-sage-900 mb-6">Explore</h2>
        
        {/* Custom Tab Switcher */}
        <div className="inline-flex bg-white p-1 rounded-full border border-sage-100 shadow-sm relative">
          <div 
            className={`absolute top-1 bottom-1 w-[120px] bg-sage-500 rounded-full transition-all duration-300 shadow-sm ${activeTab === 'journeys' ? 'left-1' : 'left-[125px]'}`}
          ></div>
          <button 
            onClick={() => setActiveTab('journeys')}
            className={`relative z-10 w-[120px] py-2 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'journeys' ? 'text-white' : 'text-sage-400 hover:text-sage-600'}`}
          >
            Library
          </button>
          <button 
            onClick={() => setActiveTab('toolbox')}
            className={`relative z-10 w-[120px] py-2 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'toolbox' ? 'text-white' : 'text-sage-400 hover:text-sage-600'}`}
          >
            Toolbox
          </button>
        </div>
      </div>

      {activeTab === 'journeys' ? (
        <div className="animate-fade-in space-y-10">
          {/* Featured Journey */}
          <GlassCard className="p-0 flex flex-col md:flex-row overflow-hidden group">
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                 <span className="px-2 py-1 bg-sage-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-md">Featured</span>
                 <span className="text-xs font-medium text-sage-400">7 Days • 10 min/day</span>
              </div>
              <h3 className="font-serif text-3xl md:text-4xl text-sage-900 mb-4">7 Days of Clarity</h3>
              <p className="text-sage-600 font-light mb-8 max-w-md">A guided week to declutter your mind, prioritize your values, and find a clear path forward.</p>
              <div className="flex items-center gap-4">
                <Button onClick={() => onNavigate('editor')} icon={<Play size={16} fill="currentColor" />}>Start Journey</Button>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-sage-100/50 flex items-center justify-center p-12 group-hover:bg-sage-100/80 transition-colors">
              <Star size={80} className="text-sage-300" strokeWidth={1} />
            </div>
          </GlassCard>

          {/* Grid */}
          <div>
            <h3 className="font-serif text-xl text-sage-900 mb-6 px-2">Popular Series</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {journeys.filter(j => !j.featured).map(journey => (
                <GlassCard key={journey.id} className="p-6 flex flex-col h-full hover:border-sage-300" onClick={() => onNavigate('editor')}>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${journey.color}`}>
                    <journey.icon size={24} />
                  </div>
                  <h4 className="font-serif text-xl text-sage-900 mb-2">{journey.title}</h4>
                  <p className="text-sm text-sage-600 font-light mb-6 flex-1">{journey.desc}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-sage-100/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-sage-400">{journey.days} Days</span>
                    <div className="w-8 h-8 rounded-full bg-white border border-sage-100 flex items-center justify-center text-sage-400 group-hover:text-sage-600 transition-colors">
                      <Play size={12} fill="currentColor" />
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in space-y-8">
           <GlassCard className="p-8 bg-gradient-to-br from-sage-50 to-white border-sage-200">
              <div className="flex items-start gap-6">
                 <div className="p-4 bg-white rounded-2xl shadow-sm text-sage-500">
                    <Target size={32} />
                 </div>
                 <div>
                    <h3 className="font-serif text-2xl text-sage-900 mb-2">Intentions Hub</h3>
                    <p className="text-sage-600 font-light mb-6 max-w-lg">The central compass for your life. Connect your daily notes to your bigger picture goals and values.</p>
                    <Button variant="secondary" onClick={() => {}}>Open Hub</Button>
                 </div>
              </div>
           </GlassCard>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="p-6 opacity-75 hover:opacity-100">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-sage-50 rounded-xl text-sage-500"><Archive size={24} /></div>
                    <Lock size={16} className="text-sage-300" />
                 </div>
                 <h4 className="font-serif text-lg text-sage-900 mb-2">The Vault</h4>
                 <p className="text-sm text-sage-600">Write letters to your future self and lock them away.</p>
              </GlassCard>

              <GlassCard className="p-6 opacity-75 hover:opacity-100">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-sage-50 rounded-xl text-sage-500"><Sparkles size={24} /></div>
                    <Lock size={16} className="text-sage-300" />
                 </div>
                 <h4 className="font-serif text-lg text-sage-900 mb-2">The Mirror</h4>
                 <p className="text-sm text-sage-600">AI-powered pattern recognition for your journal entries.</p>
              </GlassCard>

              <GlassCard className="p-6 opacity-75 hover:opacity-100">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-sage-50 rounded-xl text-sage-500"><Scale size={24} /></div>
                    <Lock size={16} className="text-sage-300" />
                 </div>
                 <h4 className="font-serif text-lg text-sage-900 mb-2">Decision Lab</h4>
                 <p className="text-sm text-sage-600">Frameworks for making difficult life choices.</p>
              </GlassCard>
           </div>
        </div>
      )}
    </div>
  );
};