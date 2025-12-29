import React from 'react';
import { ViewState } from '../../types';
import { Network, GitMerge, ArrowRight, Zap } from 'lucide-react';

interface ConnectionsProps {
  onChangeView: (view: ViewState) => void;
}

const Synthesis: React.FC<ConnectionsProps> = ({ onChangeView }) => {
  return (
    <div className="animate-fade-up max-w-5xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-6 flex items-end justify-between">
         <div>
            <h2 className="font-serif text-3xl font-medium text-text-primary mb-1">Synthesis Map</h2>
            <p className="text-text-secondary font-light">Visual network of themes. Drag nodes to merge threads.</p>
         </div>
      </div>

      {/* AI Suggestions Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
         <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Zap size={20} />
               </div>
               <div>
                  <h4 className="font-medium text-text-primary text-sm">Suggested Merge</h4>
                  <p className="text-xs text-text-secondary">"Career" and "Anxiety" overlap 80%</p>
               </div>
            </div>
            <button className="px-4 py-2 bg-white border border-purple-200 text-purple-700 text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2">
               <GitMerge size={14} /> Merge
            </button>
         </div>
         
         <div className="bg-white border border-stone-200 p-6 rounded-2xl flex items-center justify-between shadow-sm opacity-60">
             <div className="flex gap-4 items-center">
               <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center shrink-0">
                  <Network size={20} />
               </div>
               <div>
                  <h4 className="font-medium text-text-primary text-sm">Cluster Detected</h4>
                  <p className="text-xs text-text-secondary">3 threads related to "Family"</p>
               </div>
            </div>
            <button className="px-4 py-2 bg-white border border-stone-200 text-stone-500 text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-stone-50 transition-colors">
               Review
            </button>
         </div>
      </div>

      {/* Interactive Map Area */}
      <div className="flex-1 bg-white border border-stone-200 rounded-[32px] shadow-sm relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
         <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />
         
         <svg className="w-full h-full" viewBox="0 0 900 500" preserveAspectRatio="xMidYMid slice">
            {/* Dynamic Lines */}
            <line x1="450" y1="200" x2="300" y2="300" stroke="#a78bfa" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse" /> {/* Suggestion Line */}
            <line x1="450" y1="200" x2="600" y2="280" stroke="#e8e6e3" strokeWidth="2" />
            <line x1="300" y1="300" x2="200" y2="400" stroke="#e8e6e3" strokeWidth="2" />

            {/* Nodes */}
            
            {/* Main Node */}
            <g className="cursor-pointer hover:scale-110 transition-transform duration-300" transform="translate(450, 200)">
               <circle r="45" fill="white" stroke="#7d9b8a" strokeWidth="4" className="shadow-lg" />
               <text y="5" textAnchor="middle" className="font-serif text-sm font-medium fill-slate-700">Career</text>
               <text y="65" textAnchor="middle" className="text-[10px] font-bold uppercase fill-slate-400">Hub</text>
            </g>

            {/* Mergable Node */}
            <g className="cursor-pointer hover:scale-110 transition-transform duration-300" transform="translate(300, 300)">
               <circle r="35" fill="white" stroke="#a78bfa" strokeWidth="3" className="shadow-md" />
               <text y="5" textAnchor="middle" className="font-serif text-xs font-medium fill-slate-700">Anxiety</text>
               <text y="55" textAnchor="middle" className="text-[10px] font-bold uppercase fill-purple-400">Merge?</text>
            </g>

            <g className="cursor-pointer hover:scale-110 transition-transform duration-300" transform="translate(600, 280)">
               <circle r="38" fill="white" stroke="#cbd5e1" strokeWidth="2" />
               <text y="5" textAnchor="middle" className="font-serif text-sm font-medium fill-slate-600">Growth</text>
            </g>

            <g className="cursor-pointer hover:scale-110 transition-transform duration-300" transform="translate(200, 400)">
               <circle r="28" fill="white" stroke="#cbd5e1" strokeWidth="2" />
               <text y="4" textAnchor="middle" className="font-serif text-xs font-medium fill-slate-600">Sleep</text>
            </g>
         </svg>

         <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur border border-stone-200 p-4 rounded-xl shadow-lg max-w-xs">
            <p className="text-xs text-text-secondary leading-relaxed">
               <span className="font-bold text-sage">Insight:</span> The connection between Career and Anxiety has grown stronger this week. Consider unifying these threads to see the full picture.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Synthesis;