import React, { useState, useEffect } from 'react';
import { X, Heart, Sparkles, Check, Loader2, ChevronRight } from 'lucide-react';

interface ThreeGoodThingsProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

interface GratitudeCard {
  id: number;
  content: string;
  isFlipped: boolean;
  isCompleted: boolean;
}

// 100 varied gratitude prompts - randomly selected each session
const ALL_GRATITUDE_PROMPTS = [
  "Something that made you smile today...",
  "A moment of peace or joy...",
  "Something you're thankful for...",
  "A person who brightened your day...",
  "Something beautiful you noticed...",
  "A challenge that helped you grow...",
  "Something that made you laugh...",
  "A comfort you often take for granted...",
  "Someone who believed in you...",
  "A skill or ability you appreciate having...",
  "Something that went better than expected...",
  "A memory that brings you warmth...",
  "Something in nature that moved you...",
  "A kindness you witnessed or received...",
  "Something you're proud of...",
  "A lesson that changed your perspective...",
  "Someone who makes your life easier...",
  "A moment of unexpected connection...",
  "Something that brought you comfort...",
  "A place that feels like home...",
  "Something your body allowed you to do...",
  "A sound that brings you peace...",
  "Something that inspired you...",
  "A tradition you cherish...",
  "Something that made today unique...",
  "A small victory worth celebrating...",
  "Someone whose advice you value...",
  "A moment when you felt truly alive...",
  "Something that simplified your life...",
  "A creative outlet that fulfills you...",
  "Something delicious you enjoyed...",
  "A technology that improved your day...",
  "Someone who accepts you as you are...",
  "A book, song, or art that touched you...",
  "Something that gave you hope...",
  "A quality in yourself you appreciate...",
  "Something that made you feel safe...",
  "A problem that got resolved...",
  "Someone who makes you think...",
  "A moment of stillness you found...",
  "Something that exceeded your expectations...",
  "A relationship that enriches your life...",
  "Something that brought clarity...",
  "A simple pleasure you enjoyed...",
  "Someone whose work you admire...",
  "A chance encounter that was meaningful...",
  "Something that energized you...",
  "A boundary you successfully held...",
  "Something you learned today...",
  "A moment of genuine connection...",
  "Something that made you feel capable...",
  "A resource you have access to...",
  "Someone who challenged you positively...",
  "A surprise that delighted you...",
  "Something about your home you love...",
  "A habit that serves you well...",
  "Someone who remembers the little things...",
  "A moment of self-compassion...",
  "Something that brought you together with others...",
  "A tool that makes life easier...",
  "Someone whose presence calms you...",
  "A privilege you're aware of...",
  "Something that sparked your curiosity...",
  "A accomplishment from this week...",
  "Someone who truly listens...",
  "A freedom you have...",
  "Something that restored your faith...",
  "A physical sensation you enjoyed...",
  "Someone who makes you better...",
  "A moment of flow or absorption...",
  "Something that felt like a fresh start...",
  "A service or convenience you used...",
  "Someone whose story inspired you...",
  "A choice you're glad you made...",
  "Something that brought perspective...",
  "A health or ability you have...",
  "Someone who gives without expecting...",
  "A moment of unexpected beauty...",
  "Something that made you feel understood...",
  "A opportunity that came your way...",
  "Someone who forgave you...",
  "A routine that grounds you...",
  "Something that made today worth it...",
  "A insight that clicked...",
  "Someone who shows up consistently...",
  "A moment of letting go...",
  "Something your past self did right...",
  "A space that nurtures you...",
  "Someone whose humor lifts you...",
  "A sense of progress you felt...",
  "Something that felt effortless...",
  "A creature that brought you joy...",
  "Someone who trusted you...",
  "A coincidence that felt meaningful...",
  "Something that helped you relax...",
  "A gesture that touched your heart...",
  "Someone you're grateful to have met...",
  "A new experience you tried...",
  "Something that felt exactly right...",
  "A gift you received or gave..."
];

// Get 3 random prompts for this session
const getRandomPrompts = () => {
  const shuffled = [...ALL_GRATITUDE_PROMPTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

const ThreeGoodThings: React.FC<ThreeGoodThingsProps> = ({ onBack, onComplete }) => {
  // Get random prompts once on mount
  const [cardPrompts] = useState(() => getRandomPrompts());
  const [cards, setCards] = useState<GratitudeCard[]>([
    { id: 1, content: '', isFlipped: false, isCompleted: false },
    { id: 2, content: '', isFlipped: false, isCompleted: false },
    { id: 3, content: '', isFlipped: false, isCompleted: false }
  ]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [gratitudeCount] = useState(127); // Would come from historical data

  // Flip a card to reveal input
  const flipCard = (index: number) => {
    if (index !== activeCardIndex) return;

    setCards(prev => prev.map((card, i) =>
      i === index ? { ...card, isFlipped: true } : card
    ));
  };

  // Complete current card and move to next
  const completeCard = (index: number) => {
    const card = cards[index];
    if (!card.content.trim()) return;

    setCards(prev => prev.map((c, i) =>
      i === index ? { ...c, isCompleted: true } : c
    ));

    // Move to next card or show celebration
    if (index < 2) {
      setTimeout(() => {
        setActiveCardIndex(index + 1);
        // Don't auto-flip - let user tap to reveal next card
      }, 600);
    } else {
      // All cards completed - show celebration
      setTimeout(() => {
        setShowCelebration(true);
      }, 500);
    }
  };

  // Handle save
  const handleSave = async () => {
    if (isSaving) return;

    const hasContent = cards.some(c => c.content.trim());
    if (!hasContent) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const validCards = cards.filter(c => c.content.trim());
      const things = validCards.map(c => c.content.trim());

      let fullContent = `Three good things from today:\n\n`;
      fullContent += things.map((t, i) => `${i + 1}. ${t}`).join('\n');

      await onComplete(`Three Good Things`, fullContent);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Celebration screen
  if (showCelebration) {
    return (
      <div className="fixed inset-0 z-50 bg-dark-base flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
        {/* Confetti-like particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#6B8F7A', '#c47f6a', '#9b8dc2', '#f0c674'][i % 4],
                animationDelay: `${Math.random() * 1000}ms`,
                animationDuration: `${2000 + Math.random() * 1000}ms`
              }}
            />
          ))}
        </div>

        <div className="text-center max-w-md relative z-10">
          {/* Heart icon with glow */}
          <div className="w-24 h-24 bg-sage-muted text-sage rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in shadow-glow-lg">
            <Heart size={48} strokeWidth={1.5} fill="currentColor" />
          </div>

          <h2 className="font-serif text-4xl text-text-primary mb-4 animate-fade-up">
            Beautiful!
          </h2>
          <p className="text-text-secondary text-lg mb-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
            You've captured 3 moments of gratitude
          </p>
          <p className="text-text-tertiary text-sm mb-10 animate-fade-up" style={{ animationDelay: '200ms' }}>
            That's {gratitudeCount + 3} gratitudes recorded
          </p>

          {/* Preview cards */}
          <div className="flex justify-center gap-2 mb-10">
            {cards.map((card, i) => (
              <div
                key={i}
                className="w-16 h-20 bg-sage-subtle rounded-xl flex items-center justify-center animate-scale-in shadow-glow"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <Sparkles size={16} className="text-sage" />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-sage text-white rounded-full text-lg font-medium shadow-glow hover:shadow-glow-lg transition-all disabled:opacity-50 animate-fade-up"
            style={{ animationDelay: '600ms' }}
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </span>
            ) : (
              'Save Gratitudes'
            )}
          </button>

          <button
            onClick={onBack}
            className="mt-4 text-sm text-text-muted hover:text-text-secondary transition-colors"
          >
            Discard
          </button>
        </div>

        {/* Custom confetti animation */}
        <style>{`
          @keyframes confetti {
            0% {
              transform: translateY(-10vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          .animate-confetti {
            animation: confetti 3s ease-out forwards;
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
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-sage-600"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage/10 text-sage flex items-center justify-center">
            <Heart size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            3 Good Things
          </span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${card.isCompleted ? 'bg-sage shadow-md' : 'bg-sage-100'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Cards area - Stationery Background */}
      <div className="flex-1 flex items-center justify-center p-6 pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        <div className="w-full max-w-md">
          {/* Instruction text */}
          <p className="text-center text-sage-400 font-serif italic text-lg mb-10 animate-fade-up">
            Tap each card to flip and write
          </p>

          {/* Stacked cards */}
          <div className="relative h-[450px] perspective-1000">
            {cards.map((card, index) => {
              const isActive = index === activeCardIndex;
              const offset = (index - activeCardIndex) * 20;
              const scale = 1 - Math.abs(index - activeCardIndex) * 0.05;
              const zIndex = 3 - Math.abs(index - activeCardIndex);

              return (
                <div
                  key={card.id}
                  onClick={() => !card.isFlipped && flipCard(index)}
                  className={`absolute inset-0 transition-all duration-500 ease-out preserve-3d ${card.isFlipped ? 'rotate-y-180' : ''
                    } ${isActive && !card.isFlipped ? 'cursor-pointer' : ''}`}
                  style={{
                    transform: `translateY(${offset}px) scale(${scale}) ${card.isFlipped ? 'rotateY(180deg)' : ''}`,
                    zIndex,
                    opacity: card.isCompleted && !isActive ? 0.5 : 1
                  }}
                >
                  {/* Card Front - Glass/Paper Style */}
                  <div
                    className={`absolute inset-0 bg-white/80 backdrop-blur-md rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${isActive && !card.isFlipped ? 'hover:shadow-lg hover:border-sage-200' : ''
                      } transition-all`}
                  >
                    <div className="w-20 h-20 rounded-full bg-sage-50 flex items-center justify-center mb-8">
                      <Sparkles size={32} className="text-sage" strokeWidth={1.5} />
                    </div>
                    <p className="font-serif text-2xl text-sage-900 text-center leading-relaxed">
                      {cardPrompts[index]}
                    </p>
                    {isActive && !card.isFlipped && (
                      <p className="text-sm text-sage-500 mt-6 animate-pulse uppercase tracking-widest font-bold text-[10px]">
                        Tap to flip
                      </p>
                    )}
                  </div>

                  {/* Card Back - Writing Surface */}
                  <div
                    className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col backface-hidden rotate-y-180 border border-sage-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                  >
                    <p className="text-xs font-bold text-sage-300 uppercase tracking-widest mb-6 text-center">
                      {cardPrompts[index]}
                    </p>

                    <textarea
                      autoFocus={card.isFlipped && isActive}
                      value={card.content}
                      onChange={(e) => {
                        setCards(prev => prev.map((c, i) =>
                          i === index ? { ...c, content: e.target.value } : c
                        ));
                      }}
                      placeholder="Write your gratitude here..."
                      className="flex-1 w-full bg-transparent border-none p-0 text-xl font-serif text-sage-900 placeholder:text-sage-300 focus:ring-0 focus:outline-none resize-none leading-relaxed text-center"
                    />

                    {/* Complete button */}
                    {card.isFlipped && isActive && !card.isCompleted && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          completeCard(index);
                        }}
                        disabled={!card.content.trim()}
                        className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-sage text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 active:scale-95"
                      >
                        {index < 2 ? (
                          <>Next <ChevronRight size={18} /></>
                        ) : (
                          <>Finish <Check size={18} /></>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom 3D flip styles */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default ThreeGoodThings;
