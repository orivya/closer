import React, { useState, useEffect } from 'react';
import { X, Type, Check, Loader2, ArrowRight, History } from 'lucide-react';

interface OneWordProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

// Sample past words for word cloud (would come from user data)
const PAST_WORDS = [
  { word: 'Hopeful', count: 5 },
  { word: 'Tired', count: 3 },
  { word: 'Grateful', count: 8 },
  { word: 'Anxious', count: 4 },
  { word: 'Peaceful', count: 6 },
  { word: 'Excited', count: 2 },
  { word: 'Calm', count: 7 },
  { word: 'Focused', count: 4 },
  { word: 'Creative', count: 3 },
  { word: 'Overwhelmed', count: 2 }
];

const OneWord: React.FC<OneWordProps> = ({ onBack, onComplete }) => {
  const [word, setWord] = useState('');
  const [why, setWhy] = useState('');
  const [step, setStep] = useState<'word' | 'why' | 'complete'>('word');
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayWord, setDisplayWord] = useState('');

  // Animate word display
  useEffect(() => {
    if (word.length === 0) {
      setDisplayWord('');
      return;
    }

    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= word.length) {
        setDisplayWord(word.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [word]);

  // Handle word submission
  const handleWordSubmit = () => {
    if (!word.trim()) return;
    setStep('why');
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving || !word.trim()) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      let content = `My one word for today: ${word}.`;
      if (why.trim()) {
        content += `\n\nWhy this word? ${why}`;
      }

      await onComplete(`One Word: ${word}`, content);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-dark-base flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-dark-border">
        <button
          onClick={onBack}
          className="p-2 hover:bg-dark-hover rounded-full transition-colors"
        >
          <X size={24} className="text-text-secondary" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-muted text-sage flex items-center justify-center">
            <Type size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-text-muted uppercase tracking-widest">
            One Word
          </span>
        </div>

        {/* Word cloud toggle */}
        <button
          onClick={() => setShowWordCloud(!showWordCloud)}
          className={`p-2 rounded-full transition-colors ${
            showWordCloud ? 'bg-sage-subtle text-sage' : 'hover:bg-dark-hover text-text-secondary'
          }`}
        >
          <History size={20} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto pb-28 lg:pb-10">
        {/* Word cloud overlay */}
        {showWordCloud && (
          <div className="absolute inset-0 z-10 bg-dark-base/95 backdrop-blur-sm p-6 animate-fade-in overflow-y-auto">
            <div className="max-w-lg mx-auto pt-10">
              <h3 className="font-serif text-xl text-text-primary text-center mb-8">
                Your Word History
              </h3>

              <div className="flex flex-wrap justify-center gap-3">
                {PAST_WORDS.sort((a, b) => b.count - a.count).map((item, i) => (
                  <button
                    key={item.word}
                    onClick={() => {
                      setWord(item.word);
                      setShowWordCloud(false);
                    }}
                    className="px-4 py-2 rounded-full bg-dark-surface hover:bg-dark-hover transition-all animate-fade-up"
                    style={{
                      animationDelay: `${i * 50}ms`,
                      fontSize: `${Math.max(14, Math.min(24, 12 + item.count * 2))}px`,
                      opacity: 0.5 + (item.count / 10) * 0.5
                    }}
                  >
                    <span className="text-text-primary">{item.word}</span>
                    <span className="text-text-muted ml-2 text-xs">×{item.count}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowWordCloud(false)}
                className="w-full mt-10 py-3 text-text-secondary hover:text-text-primary transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Enter word */}
        {step === 'word' && (
          <div className="max-w-lg mx-auto w-full px-6 py-16 text-center animate-fade-up">
            <p className="text-text-tertiary mb-6">
              If you had to describe this moment in one word...
            </p>

            {/* Large word display */}
            <div className="min-h-[120px] flex items-center justify-center mb-12">
              {word ? (
                <h1 className="font-serif text-6xl md:text-7xl text-text-primary tracking-wide">
                  {displayWord}
                  <span className="animate-pulse text-sage">|</span>
                </h1>
              ) : (
                <p className="text-4xl text-text-muted font-serif italic">your word</p>
              )}
            </div>

            {/* Input */}
            <input
              type="text"
              autoFocus
              value={word}
              onChange={(e) => setWord(e.target.value.replace(/\s/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && handleWordSubmit()}
              maxLength={20}
              placeholder="Type your word..."
              className="w-full max-w-xs mx-auto bg-transparent border-b-2 border-dark-border p-4 text-2xl text-center text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage transition-colors"
            />

            <button
              onClick={handleWordSubmit}
              disabled={!word.trim()}
              className="mt-10 px-8 py-4 bg-sage text-white rounded-full text-lg font-medium shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-3 mx-auto"
            >
              Continue <ArrowRight size={20} />
            </button>
          </div>
        )}

        {/* Step 2: Why this word */}
        {step === 'why' && (
          <div className="max-w-lg mx-auto w-full px-6 py-10 animate-fade-up">
            {/* Display chosen word */}
            <div className="text-center mb-10">
              <p className="text-text-muted text-sm mb-3">Your word</p>
              <h2 className="font-serif text-5xl text-text-primary mb-2">{word}</h2>
            </div>

            <div className="glass-card rounded-3xl p-6 mb-8">
              <p className="text-text-secondary mb-4">
                Why does this word capture your moment?
              </p>

              <textarea
                autoFocus
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Because... (optional)"
                className="w-full bg-transparent border-none p-0 text-lg font-serif text-text-primary placeholder:text-text-muted focus:ring-0 focus:outline-none resize-none leading-relaxed min-h-[150px]"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('word')}
                className="flex-1 py-4 bg-dark-surface text-text-secondary rounded-full font-medium hover:bg-dark-hover transition-all"
              >
                Change Word
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-4 bg-sage text-white rounded-full font-medium shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Word
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneWord;
