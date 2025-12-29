import React from 'react';
import { INTENT_PILLS, IntentPill } from '../../types/essence';

interface IntentPillsProps {
  onSelect: (intent: IntentPill) => void;
  disabled?: boolean;
  selectedIntent?: string | null;
}

/**
 * Intent Pills
 * Quick-select buttons for common conversation intents
 */
export const IntentPills: React.FC<IntentPillsProps> = ({
  onSelect,
  disabled = false,
  selectedIntent = null,
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-lg">
      {INTENT_PILLS.map((intent) => (
        <button
          key={intent.id}
          onClick={() => !disabled && onSelect(intent)}
          disabled={disabled}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-300
            ${selectedIntent === intent.id
              ? 'bg-sage-600 text-white shadow-md shadow-sage-200 scale-105'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-sage-300 hover:text-sage-700 hover:bg-sage-50 hover:shadow-sm'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {intent.label}
        </button>
      ))}
    </div>
  );
};

/**
 * Compact intent display for session header
 */
export const IntentBadge: React.FC<{ intentId: string }> = ({ intentId }) => {
  const intent = INTENT_PILLS.find((p) => p.id === intentId);
  if (!intent) return null;

  return (
    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-sage-50 text-sage-600 text-[10px] font-medium">
      <span>{intent.label}</span>
    </div>
  );
};

export default IntentPills;
