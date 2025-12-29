import React, { useState } from 'react';
import { GitBranch, Search, Calendar, List, AlignLeft, Filter } from 'lucide-react';
import { Entry } from '../types';

interface JournalProps {
  entries: Entry[];
  onNavigate: (view: any, data?: any) => void;
}

export const Journal: React.FC<JournalProps> = ({ entries, onNavigate }) => {
  const [filter, setFilter] = useState<'all' | 'threads' | 'reflections'>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Simple filtering logic
  const filteredEntries = entries.filter(entry => {
    if (filter === 'threads') return !!entry.thread;
    return true;
  });

  return (
    <div className="animate-fade-up max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="font-serif text-4xl text-sage-900 mb-2">Journal</h2>
          <p className="text-sage-600 font-light">Your growing timeline of thoughts.</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-sage-100 shadow-sm">
          <button 
            onClick={() => setViewMode('timeline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'timeline' ? 'bg-sage-500 text-white shadow-md' : 'text-sage-400 hover:text-sage-600'}`}
          >
            <List size={14} /> Stream
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${viewMode === 'calendar' ? 'bg-sage-500 text-white shadow-md' : 'text-sage-400 hover:text-sage-600'}`}
          >
            <Calendar size={14} /> Calendar
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-sage-200 pb-1 mb-8">
        <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setFilter('all')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filter === 'all' ? 'border-sage-500 text-sage-900' : 'border-transparent text-sage-400 hover:text-sage-600'}`}
          >
            All Entries
          </button>
          <button 
            onClick={() => setFilter('threads')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filter === 'threads' ? 'border-sage-500 text-sage-900' : 'border-transparent text-sage-400 hover:text-sage-600'}`}
          >
            Threads
          </button>
          <button 
            onClick={() => setFilter('reflections')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${filter === 'reflections' ? 'border-sage-500 text-sage-900' : 'border-transparent text-sage-400 hover:text-sage-600'}`}
          >
            Reflections
          </button>
        </div>
        
        <div className="relative w-full sm:w-64 mb-2 sm:mb-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" size={16} />
          <input 
            type="text" 
            placeholder="Search entries..." 
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-transparent focus:border-sage-200 rounded-xl text-sm outline-none text-sage-800 placeholder:text-sage-300 transition-all"
          />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 text-sage-400">
            <p>No entries found.</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="relative pl-8 md:pl-12 group animate-fade-in">
              {/* Timeline Line */}
              <div className="absolute left-[3.5px] top-8 bottom-[-32px] w-px bg-sage-200 group-last:hidden"></div>
              
              {/* Timeline Dot */}
              <div className="absolute -left-[1px] top-8 w-2.5 h-2.5 rounded-full bg-sage-300 border-2 border-cream group-hover:bg-sage-600 group-hover:scale-125 transition-all duration-300 shadow-sm z-10"></div>
              
              {/* Date Header (Only if it changes, simplified here for demo) */}
              <div className="mb-2 pl-1">
                <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">{entry.date}</span>
              </div>

              <div 
                onClick={() => onNavigate('editor', { entryId: entry.id })}
                className="bg-surface hover:bg-white backdrop-blur-md border border-white/60 p-6 md:p-8 rounded-[2rem] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(107,143,122,0.15)] hover:-translate-y-1 group-hover:border-sage-200"
              >
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-xl md:text-2xl text-sage-900 group-hover:text-sage-700 transition-colors">{entry.title}</h3>
                    {entry.thread && (
                      <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-wider text-sage-600 border border-sage-100/50">
                          <GitBranch size={10} /> {entry.thread}
                      </div>
                    )}
                </div>
                <p className="text-sage-600 text-base font-light leading-relaxed line-clamp-2 md:line-clamp-3">{entry.preview}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-sage-400 font-medium">
                  <span>{entry.wordCount} words</span>
                  {entry.mood && (
                     <>
                      <span className="w-1 h-1 rounded-full bg-sage-300"></span>
                      <span>{entry.mood}</span>
                     </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
