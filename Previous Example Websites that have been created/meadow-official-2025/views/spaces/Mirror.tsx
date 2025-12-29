import React, { useState, useEffect } from 'react';
import { ViewState } from '../../types';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Feather } from 'lucide-react';
import { JournalService } from '../../services/journal';
import { AIService } from '../../services/ai';

interface MirrorProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

interface Reflection {
  title: string;
  text: string;
  context: string;
  action: string;
}

const Mirror: React.FC<MirrorProps> = ({ onChangeView }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReflections = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch recent entries
        const entries = await JournalService.getRecentEntries(20);
        
        if (entries.length < 5) {
          setError('not_enough_entries');
          setIsLoading(false);
          return;
        }

        // Generate AI reflections
        const aiReflections = await AIService.getMirrorReflections(entries);
        
        if (!aiReflections || aiReflections.length === 0) {
          setError('no_reflections');
          setIsLoading(false);
          return;
        }

        setReflections(aiReflections);
        setActiveIndex(0);
      } catch (err: any) {
        console.error('Failed to load reflections:', err);
        if (err?.message?.includes('at least 5 entries')) {
          setError('not_enough_entries');
        } else if (err?.message?.includes('Upgrade required')) {
          setError('upgrade_required');
        } else {
          setError('failed');
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadReflections();
  }, []);

  const current = reflections[activeIndex];

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up text-center py-20">
        <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-sage-subtle rounded-full animate-pulse" />
          <div className="absolute inset-4 bg-sage/20 rounded-full blur-xl" />
          <div className="relative w-full h-full border-2 border-sage/20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Loader2 className="w-12 h-12 text-sage animate-spin" />
          </div>
        </div>
        <p className="text-text-secondary font-light">Reflecting on your entries...</p>
      </div>
    );
  }

  // Error states
  if (error === 'not_enough_entries') {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up text-center py-20">
        <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-sage-subtle rounded-full" />
          <div className="absolute inset-4 bg-sage/20 rounded-full blur-xl" />
          <div className="relative w-full h-full border-2 border-sage/20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Sparkles size={48} className="text-sage opacity-80" strokeWidth={1} />
          </div>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4 leading-tight">
          Reflections are brewing
        </h2>
        <p className="text-text-secondary font-light text-lg leading-relaxed max-w-lg mx-auto mb-8">
          Write at least 5 journal entries to start seeing patterns and reflections here.
        </p>
        <button
          onClick={() => onChangeView(ViewState.EDITOR)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
        >
          <Feather size={18} />
          Start writing
        </button>
      </div>
    );
  }

  if (error === 'upgrade_required') {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up text-center py-20">
        <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-sage-subtle rounded-full" />
          <div className="absolute inset-4 bg-sage/20 rounded-full blur-xl" />
          <div className="relative w-full h-full border-2 border-sage/20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Sparkles size={48} className="text-sage opacity-80" strokeWidth={1} />
          </div>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4 leading-tight">
          Upgrade to see reflections
        </h2>
        <p className="text-text-secondary font-light text-lg leading-relaxed max-w-lg mx-auto mb-8">
          AI-powered reflections are available with Pro or Premium plans.
        </p>
        <button
          onClick={() => onChangeView(ViewState.PRICING)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
        >
          View plans
        </button>
      </div>
    );
  }

  if (error || reflections.length === 0) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-up text-center py-20">
        <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
          <div className="absolute inset-0 bg-sage-subtle rounded-full" />
          <div className="absolute inset-4 bg-sage/20 rounded-full blur-xl" />
          <div className="relative w-full h-full border-2 border-sage/20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <Sparkles size={48} className="text-sage opacity-80" strokeWidth={1} />
          </div>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-4 leading-tight">
          Reflections coming soon
        </h2>
        <p className="text-text-secondary font-light text-lg leading-relaxed max-w-lg mx-auto">
          Keep writing and check back later to see patterns emerge.
        </p>
      </div>
    );
  }

  // Main reflection display
  return (
    <div className="max-w-2xl mx-auto animate-fade-up text-center py-10 pb-20">
      <div className="relative w-40 h-40 mx-auto mb-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-sage-subtle rounded-full animate-pulse" />
        <div className="absolute inset-4 bg-sage/20 rounded-full blur-xl" />
        <div className="relative w-full h-full border-2 border-sage/20 rounded-full flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <Sparkles size={48} className="text-sage opacity-80" strokeWidth={1} />
        </div>
      </div>

      <div className="mb-12">
        <span className="text-xs font-bold text-sage uppercase tracking-widest mb-4 block">
          Reflection {activeIndex + 1} of {reflections.length}
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-text-primary mb-6 leading-tight">
          {current.text}
        </h2>
        <p className="text-text-secondary font-light text-lg leading-relaxed max-w-lg mx-auto">
          {current.context}
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-xs mx-auto mb-16">
        <button 
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: current.action })}
          className="w-full py-3.5 bg-text-primary text-white rounded-xl font-medium shadow-lg hover:bg-black transition-all hover:-translate-y-0.5"
        >
          {current.action}
        </button>
        <button 
          onClick={() => onChangeView(ViewState.EDITOR, { prompt: current.text })}
          className="w-full py-3.5 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
        >
          Write about this reflection
        </button>
      </div>

      {reflections.length > 1 && (
        <div className="flex items-center justify-center gap-4 border-t border-stone-200 pt-8 max-w-xs mx-auto">
          <button 
            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="p-3 rounded-full border border-stone-200 text-text-muted disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-xs font-medium text-text-muted">
            Navigate
          </span>
          <button 
            onClick={() => setActiveIndex(Math.min(reflections.length - 1, activeIndex + 1))}
            disabled={activeIndex === reflections.length - 1}
            className="p-3 rounded-full border border-stone-200 text-text-muted disabled:opacity-30 hover:bg-stone-50 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Mirror;
