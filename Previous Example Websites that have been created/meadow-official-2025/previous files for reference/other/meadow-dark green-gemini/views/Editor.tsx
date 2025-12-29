import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, MoreHorizontal } from 'lucide-react';
import { Button } from '../components/ui';
import { Entry } from '../types';

interface EditorProps {
  initialData?: Entry | null;
  initialPrompt?: string;
  onSave: (entry: Partial<Entry>) => void;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialData, initialPrompt, onSave, onBack }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [thread, setThread] = useState(initialData?.thread || '');
  const [wordCount, setWordCount] = useState(initialData?.wordCount || 0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
    // Update word count
    const count = content.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(count);
  }, [content]);

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({
      id: initialData?.id,
      title: title || 'Untitled Entry',
      content,
      thread: thread || undefined,
      wordCount,
      preview: content.slice(0, 150) + '...',
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col relative animate-fade-in">
      {/* Floating Header */}
      <header className="sticky top-6 z-20 px-6 mb-8">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-sage-900/5 rounded-full px-4 py-3 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-sage-50 text-sage-500 hover:text-sage-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-sage-300 hidden sm:block">
              {wordCount} words
            </span>
            <div className="h-4 w-px bg-sage-200 hidden sm:block"></div>
            <Button onClick={handleSave} disabled={!content.trim()} className="px-6 py-2.5 h-auto text-xs shadow-md">
              Save Entry
            </Button>
            <button className="text-sage-400 hover:text-sage-600">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Editor Area */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 pb-32">
        {initialPrompt && (
          <div className="mb-12 animate-fade-up">
            <div className="inline-flex items-center gap-2 text-sage-400 mb-3 px-3 py-1 bg-sage-50 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} /> Prompt
            </div>
            <p className="font-serif text-2xl md:text-3xl text-sage-800 leading-snug">{initialPrompt}</p>
          </div>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a title..."
          className="w-full bg-transparent text-4xl md:text-5xl font-serif text-sage-900 placeholder:text-sage-200 outline-none mb-8 leading-tight tracking-tight"
        />

        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full bg-transparent text-lg md:text-xl leading-relaxed text-sage-800 placeholder:text-sage-200 outline-none resize-none min-h-[50vh] font-light selection:bg-sage-200"
          spellCheck={false}
        />

        <div className="mt-20 pt-10 border-t border-sage-100 flex items-center gap-4">
          <div className="text-xs font-bold uppercase tracking-widest text-sage-300">Thread</div>
          <input
            type="text"
            value={thread}
            onChange={(e) => setThread(e.target.value)}
            placeholder="Add to a thread..."
            className="flex-1 bg-transparent text-sm font-medium text-sage-600 placeholder:text-sage-300 outline-none hover:text-sage-800 transition-colors"
          />
        </div>
      </main>
    </div>
  );
};
