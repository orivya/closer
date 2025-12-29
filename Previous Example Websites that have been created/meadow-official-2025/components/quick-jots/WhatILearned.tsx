import React, { useState } from 'react';
import { X, Lightbulb, Check, Loader2, BookOpen, Star, Search, Plus, Trash2 } from 'lucide-react';

interface WhatILearnedProps {
  onBack: () => void;
  onComplete: (title: string, content: string) => void | Promise<void>;
}

interface Lesson {
  id: number;
  content: string;
  isFavorite: boolean;
}

// Sample past lessons for wisdom library (would come from user data)
const PAST_LESSONS = [
  { content: "Small consistent actions beat big inconsistent ones", date: '2 days ago' },
  { content: "Saying no is sometimes the kindest thing you can do", date: '1 week ago' },
  { content: "The best ideas come when I'm not trying to have them", date: '2 weeks ago' }
];

const WhatILearned: React.FC<WhatILearnedProps> = ({ onBack, onComplete }) => {
  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 1, content: '', isFavorite: false }
  ]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [totalLessons] = useState(32); // Would come from user data

  // Add lesson
  const addLesson = () => {
    setLessons(prev => [
      ...prev,
      { id: Date.now(), content: '', isFavorite: false }
    ]);
  };

  // Update lesson
  const updateLesson = (id: number, updates: Partial<Lesson>) => {
    setLessons(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  // Remove lesson
  const removeLesson = (id: number) => {
    if (lessons.length <= 1) return;
    setLessons(prev => prev.filter(l => l.id !== id));
  };

  // Handle save
  const handleSave = async () => {
    const validLessons = lessons.filter(l => l.content.trim());
    if (validLessons.length === 0 || isSaving) return;

    setIsSaving(true);
    try {
      const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });

      const lessonTexts = validLessons.map(lesson => lesson.content);

      let content = validLessons.length === 1
        ? `Today I learned: ${lessonTexts[0]}.`
        : `Today's lessons:\n\n${lessonTexts.map((l, i) => `${i + 1}. ${l}`).join('\n')}`;

      await onComplete(`Lessons Learned`, content);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f7] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-stone-200 bg-white/50 backdrop-blur-sm">
        <button
          onClick={onBack}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-stone-400"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-50 text-sage-600 flex items-center justify-center">
            <Lightbulb size={20} strokeWidth={1.5} />
          </div>
          <span className="text-xs font-bold text-sage-400 uppercase tracking-widest">
            What I Learned
          </span>
        </div>

        {/* Wisdom library toggle */}
        <button
          onClick={() => setShowLibrary(!showLibrary)}
          className={`p-2 rounded-full transition-colors ${showLibrary ? 'bg-sage-50 text-sage-600' : 'hover:bg-stone-50 text-stone-400'
            }`}
        >
          <BookOpen size={20} />
        </button>
      </div>

      {/* Wisdom library overlay */}
      {showLibrary && (
        <div className="absolute inset-0 z-10 bg-[#faf9f7]/95 backdrop-blur-md animate-fade-in overflow-y-auto pt-24">
          <div className="max-w-lg mx-auto px-6 py-8">
            <h3 className="font-serif text-3xl text-sage-900 text-center mb-2">
              Your Wisdom Library
            </h3>
            <p className="text-stone-400 text-center mb-10 font-serif italic">
              {totalLessons} lessons collected
            </p>

            {/* Search */}
            <div className="relative mb-10">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search your lessons..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-full text-sage-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all shadow-sm"
              />
            </div>

            {/* Past lessons */}
            <div className="space-y-4">
              {PAST_LESSONS.map((lesson, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-sm border border-stone-100 animate-fade-up hover:shadow-md transition-all"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sage-50 text-sage-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sage-900 mb-2 leading-relaxed font-serif text-lg">{lesson.content}</p>
                      <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">{lesson.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowLibrary(false)}
              className="w-full mt-10 py-3 text-stone-400 hover:text-stone-600 transition-colors uppercase tracking-widest text-xs font-bold"
            >
              Close Library
            </button>
          </div>
        </div>
      )}

      {/* Main content - Stationery Background */}
      <div className="flex-1 overflow-y-auto pb-28 lg:pb-10 bg-gradient-to-br from-[#faf9f7] to-[#f0efe9]">
        <div className="max-w-lg mx-auto w-full px-6 py-8">
          <h2 className="font-serif text-3xl text-sage-900 text-center mb-2 animate-fade-up">
            Capture Your Wisdom
          </h2>
          <p className="text-stone-400 text-center mb-10 font-serif italic animate-fade-up" style={{ animationDelay: '50ms' }}>
            What did today teach you?
          </p>

          {/* Lesson cards */}
          <div className="space-y-6 mb-8">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 animate-fade-up shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-white/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sage-50 text-sage-500 flex items-center justify-center">
                      <Lightbulb size={16} />
                    </div>
                    <span className="text-xs font-bold text-sage-300 uppercase tracking-widest">Lesson {index + 1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateLesson(lesson.id, { isFavorite: !lesson.isFavorite })}
                      className={`p-1.5 rounded-full transition-colors ${lesson.isFavorite ? 'text-sage-400' : 'text-stone-300 hover:text-sage-400'
                        }`}
                    >
                      <Star size={18} fill={lesson.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    {lessons.length > 1 && (
                      <button
                        onClick={() => removeLesson(lesson.id)}
                        className="p-1.5 rounded-full text-stone-300 hover:text-stone-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lesson content */}
                <textarea
                  value={lesson.content}
                  onChange={(e) => updateLesson(lesson.id, { content: e.target.value })}
                  placeholder="Today I learned that..."
                  className="w-full bg-transparent border-none p-0 text-xl font-serif text-sage-900 placeholder:text-stone-300/50 focus:ring-0 focus:outline-none resize-none min-h-[120px] leading-relaxed"
                />
              </div>
            ))}
          </div>

          {/* Add more button */}
          <button
            onClick={addLesson}
            className="w-full py-4 border-2 border-dashed border-stone-200 rounded-2xl text-stone-400 hover:border-sage-300 hover:text-sage-600 hover:bg-white/50 transition-all flex items-center justify-center gap-2 mb-8 group"
          >
            <Plus size={18} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium">Add Another Lesson</span>
          </button>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!lessons.some(l => l.content.trim()) || isSaving}
            className="w-full py-4 bg-sage-900 text-white rounded-full text-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={20} />
                Save Lessons
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatILearned;
