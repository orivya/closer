import React, { useState } from 'react';
import { X, Trophy, Check, Loader2, Sparkles, Star } from 'lucide-react';

interface WinsProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

type WinSize = 'small' | 'medium' | 'big';
type WinCategory = 'personal' | 'work' | 'health' | 'relationships' | 'learning' | 'other';

interface Win {
  id: number;
  content: string;
  size: WinSize;
  category: WinCategory;
}

const WIN_SIZES: { value: WinSize; label: string; emoji: string }[] = [
  { value: 'small', label: 'Small Win', emoji: '✨' },
  { value: 'medium', label: 'Good Win', emoji: '🌟' },
  { value: 'big', label: 'Big Win!', emoji: '🏆' }
];

// Standardized categories to Sage/Stone aesthetic
const WIN_CATEGORIES: { value: WinCategory; label: string; color: string }[] = [
  { value: 'personal', label: 'Personal', color: 'bg-sage-200 text-sage-800' },
  { value: 'work', label: 'Work', color: 'bg-stone-200 text-stone-700' },
  { value: 'health', label: 'Health', color: 'bg-sage-300 text-sage-900' },
  { value: 'relationships', label: 'Relationships', color: 'bg-stone-300 text-stone-800' },
  { value: 'learning', label: 'Learning', color: 'bg-sage-100 text-sage-700' },
  { value: 'other', label: 'Other', color: 'bg-stone-100 text-stone-600' }
];

const Wins: React.FC<WinsProps> = ({ onBack, onComplete }) => {
  const [wins, setWins] = useState<Win[]>([
    { id: 1, content: '', size: 'medium', category: 'personal' }
  ]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [totalWins] = useState(47); // Would come from user data

  // Add new win
  const addWin = () => {
    setWins(prev => [
      ...prev,
      { id: Date.now(), content: '', size: 'medium', category: 'personal' }
    ]);
  };

  // Update win
  const updateWin = (id: number, updates: Partial<Win>) => {
    setWins(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  // Remove win
  const removeWin = (id: number) => {
    if (wins.length <= 1) return;
    setWins(prev => prev.filter(w => w.id !== id));
  };

  // Handle save
  const handleSave = async () => {
    const validWins = wins.filter(w => w.content.trim());
    if (validWins.length === 0 || isSaving) return;

    setIsSaving(true);
    try {
      // Show celebration first
      setShowCelebration(true);
      await new Promise(resolve => setTimeout(resolve, 2500));

      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      const winDescriptions = validWins.map(win => {
        const size = WIN_SIZES.find(s => s.value === win.size);
        const category = WIN_CATEGORIES.find(c => c.value === win.category);
        return `${win.content} (${size?.label?.toLowerCase()} win in ${category?.label?.toLowerCase()})`;
      });

      let content = validWins.length === 1
        ? `Today I celebrated a win: ${winDescriptions[0]}.`
        : `Today's wins:\n\n${winDescriptions.map((d, i) => `${i + 1}. ${d}`).join('\n')}`;

      await onComplete(`Today's Wins`, content);
    } catch (error) {
      console.error('Failed to save:', error);
      setShowCelebration(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Celebration screen
  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#84a98c', '#a8a29e', '#52796f', '#d6d3d1', '#cad2c5'][i % 5],
                animationDelay: `${Math.random() * 2000}ms`,
              }}
            />
          ))}
        </div>

        <div className="text-center max-w-md relative z-10">
          {/* Trophy with glow */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-sage-200/50 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-sage-300/30 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy size={64} className="text-sage-600 animate-scale-in" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="font-serif text-4xl text-sage-900 mb-4 animate-fade-up">
            Victory!
          </h2>

          <p className="text-stone-500 text-lg mb-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
            You celebrated {wins.filter(w => w.content.trim()).length} win{wins.filter(w => w.content.trim()).length > 1 ? 's' : ''} today!
          </p>

          <p className="text-stone-400 text-sm animate-fade-up" style={{ animationDelay: '200ms' }}>
            That's {totalWins + wins.filter(w => w.content.trim()).length} total wins recorded
          </p>

          {/* Win previews */}
          <div className="flex justify-center gap-3 mt-8">
            {wins.filter(w => w.content.trim()).map((win, i) => (
              <div
                key={win.id}
                className="w-12 h-12 rounded-xl bg-sage-50 border border-sage-100 flex items-center justify-center animate-scale-in"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <span className="text-lg">
                  {WIN_SIZES.find(s => s.value === win.size)?.emoji}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confetti animation */}
        <style>{`
          @keyframes confetti-fall {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-confetti-fall {
            animation: confetti-fall 3s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-sage-100 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-sage-600/60"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Trophy size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            Wins
          </span>
        </div>

        {/* Win counter */}
        <div className="flex items-center gap-2 text-sage-600">
          <Star size={16} fill="currentColor" />
          <span className="text-sm font-medium">{totalWins}</span>
        </div>
      </div>

      {/* Main content - Stationery Background */}
      <div className="flex-1 overflow-y-auto pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        <div className="max-w-lg mx-auto w-full px-6 py-8">
          <h2 className="font-serif text-3xl text-sage-900 text-center mb-2 animate-fade-up">
            Celebrate Your Wins
          </h2>
          <p className="text-sage-400 text-center mb-10 animate-fade-up font-serif italic" style={{ animationDelay: '50ms' }}>
            No win is too small to celebrate
          </p>

          {/* Win cards */}
          <div className="space-y-6 mb-8">
            {wins.map((win, index) => (
              <div
                key={win.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 animate-fade-up shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Win number and remove */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sage-50 text-sage-600 flex items-center justify-center text-sm font-bold font-serif">
                      {index + 1}
                    </div>
                    <span className="text-xs font-bold text-sage-300 uppercase tracking-widest">Win #{index + 1}</span>
                  </div>
                  {wins.length > 1 && (
                    <button
                      onClick={() => removeWin(win.id)}
                      className="text-xs text-stone-300 hover:text-stone-500 transition-colors uppercase tracking-wider font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Win content */}
                <textarea
                  value={win.content}
                  onChange={(e) => updateWin(win.id, { content: e.target.value })}
                  placeholder="What did you accomplish?"
                  className="w-full bg-transparent border-none p-0 text-xl font-serif text-sage-900 placeholder:text-sage-300/50 focus:ring-0 focus:outline-none resize-none min-h-[80px] mb-6 leading-relaxed"
                />

                {/* Win size and Category Row */}
                <div className="flex flex-col gap-4">
                  {/* Size Selector */}
                  <div className="flex gap-2 p-1 bg-stone-50 rounded-xl border border-stone-100">
                    {WIN_SIZES.map(size => (
                      <button
                        key={size.value}
                        onClick={() => updateWin(win.id, { size: size.value })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${win.size === size.value
                          ? 'bg-white text-sage-700 shadow-sm border border-stone-100'
                          : 'text-stone-400 hover:text-stone-600'
                          }`}
                      >
                        <span className="mr-1">{size.emoji}</span> {size.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-2">
                    {WIN_CATEGORIES.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => updateWin(win.id, { category: cat.value })}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${win.category === cat.value
                          ? `${cat.color} shadow-sm ring-1 ring-inset ring-black/5`
                          : 'bg-white border border-stone-100 text-stone-400 hover:bg-stone-50'
                          }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add more button */}
          <button
            onClick={addWin}
            className="w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-sage-50/30 transition-all flex items-center justify-center gap-2 mb-8 group"
          >
            <Sparkles size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Add Another Win</span>
          </button>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!wins.some(w => w.content.trim()) || isSaving}
            className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Trophy size={20} />
                Celebrate Wins
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wins;
