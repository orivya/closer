/**
 * QuickAddGoal Component
 * Inline input for quickly adding new goals
 */

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { CreateGoalRequest } from '../../types/goals';

interface QuickAddGoalProps {
  onAdd: (request: CreateGoalRequest) => Promise<void>;
  placeholder?: string;
  autoFocus?: boolean;
  defaultIntentionId?: string;
  onCancel?: () => void;
  compact?: boolean;
}

export const QuickAddGoal: React.FC<QuickAddGoalProps> = ({
  onAdd,
  placeholder = 'Add a new goal...',
  autoFocus = false,
  defaultIntentionId,
  onCancel,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(autoFocus);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        content: content.trim(),
        intentionId: defaultIntentionId,
        source: 'manual',
      });
      setContent('');
      if (!autoFocus) {
        setIsExpanded(false);
      }
    } catch (error) {
      console.error('Failed to add goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setContent('');
      setIsExpanded(false);
      onCancel?.();
    }
  };

  const handleCancel = () => {
    setContent('');
    setIsExpanded(false);
    onCancel?.();
  };

  // Collapsed state - show button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={`
          w-full flex items-center gap-3 text-stone-400 hover:text-sage-600
          transition-all duration-300 rounded-2xl border-2 border-dashed border-stone-200
          hover:border-sage-300 hover:bg-sage-50/30 group
          ${compact ? 'px-4 py-3' : 'px-5 py-4'}
        `}
      >
        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-sage-100 group-hover:text-sage-600 transition-colors">
          <Plus size={14} />
        </div>
        <span className="text-sm font-medium">{placeholder}</span>
      </button>
    );
  }

  // Expanded state - show input
  return (
    <div
      className={`
        flex items-center gap-3 bg-white rounded-2xl border-2 border-sage-200
        shadow-sm focus-within:ring-4 focus-within:ring-sage-50/50 
        transition-all duration-300 transform scale-[1.01]
        ${compact ? 'px-4 py-3' : 'px-5 py-4'}
      `}
    >
      <div className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
        <Plus size={14} />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="flex-1 text-sm text-stone-800 placeholder:text-stone-300 bg-transparent outline-none font-medium"
      />

      <div className="flex items-center gap-2">
        {content.trim() && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`
              p-2 rounded-xl transition-all duration-300
              ${isSubmitting
                ? 'bg-stone-100 text-stone-400'
                : 'bg-sage-500 text-white hover:bg-sage-600 shadow-md hover:shadow-lg hover:-translate-y-0.5'
              }
            `}
          >
            <Send size={14} />
          </button>
        )}

        <button
          onClick={handleCancel}
          className="p-2 text-stone-300 hover:text-stone-500 hover:bg-stone-100 rounded-xl transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuickAddGoal;
