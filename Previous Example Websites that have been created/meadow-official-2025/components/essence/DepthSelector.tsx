import React, { useState } from 'react';
import { DepthLevel, DEPTH_LEVELS, DepthLevelConfig } from '../../types/essence';
import { ChevronDown, Check, Wind, Brain, Compass, Layers } from 'lucide-react';

interface DepthSelectorProps {
  selectedDepth: DepthLevel;
  onSelect: (depth: DepthLevel) => void;
  compact?: boolean;
  disabled?: boolean;
}

const getDepthIcon = (id: DepthLevel) => {
  switch (id) {
    case 'vent': return <Wind size={18} />;
    case 'reflect': return <Brain size={18} />;
    case 'explore': return <Compass size={18} />;
    case 'deep': return <Layers size={18} />;
    default: return <Compass size={18} />;
  }
};

/**
 * Depth Level Selector
 * Allows users to choose the conversation depth:
 * - Vent: Just listen, no questions
 * - Reflect: Light exploration
 * - Explore: Deeper inquiry
 * - Deep: Unknown unknowns, challenging questions
 */
export const DepthSelector: React.FC<DepthSelectorProps> = ({
  selectedDepth,
  onSelect,
  compact = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const depthLevels = Object.values(DEPTH_LEVELS);
  const selectedConfig = DEPTH_LEVELS[selectedDepth];

  const handleSelect = (id: DepthLevel) => {
    onSelect(id);
    setIsOpen(false);
  };

  if (compact) {
    // Compact pill-style selector for header
    return (
      <div className="relative z-50">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300
            ${disabled
              ? 'opacity-50 cursor-not-allowed bg-stone-100 text-stone-400'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-sage-300 hover:text-sage-700 shadow-sm'
            }
          `}
        >
          <span className="text-sage-600">{getDepthIcon(selectedDepth)}</span>
          <span>{selectedConfig.name}</span>
          <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && !disabled && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 ring-1 ring-black/5 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              {depthLevels.map((config) => (
                <button
                  key={config.id}
                  onClick={() => handleSelect(config.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 group
                    ${config.id === selectedDepth
                      ? 'bg-sage-50/80 text-sage-900'
                      : 'hover:bg-stone-50 text-stone-600'
                    }
                  `}
                >
                  <span className={`
                    shrink-0 p-2 rounded-lg transition-colors
                    ${config.id === selectedDepth ? 'bg-sage-100 text-sage-700' : 'bg-stone-100 text-stone-400 group-hover:text-sage-500 group-hover:bg-sage-50'}
                  `}>
                    {getDepthIcon(config.id)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{config.name}</div>
                    <div className="text-[11px] text-stone-500 leading-tight mt-0.5 truncate opacity-80">{config.shortDescription}</div>
                  </div>
                  {config.id === selectedDepth && (
                    <Check size={14} className="text-sage-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Full card-style selector for welcome screen
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-[11px] font-bold text-stone-400 mb-4 text-center uppercase tracking-[0.2em]">
        Choose your mode
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {depthLevels.map((config) => (
          <button
            key={config.id}
            onClick={() => handleSelect(config.id)}
            disabled={disabled}
            className={`
              relative p-4 rounded-xl text-left transition-all duration-300 group ring-1 ring-inset
              ${config.id === selectedDepth
                ? 'bg-white shadow-md ring-sage-300 ring-offset-2'
                : 'bg-white/60 hover:bg-white hover:shadow-lg hover:-translate-y-0.5 ring-stone-200 hover:ring-sage-200'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl transition-colors ${config.id === selectedDepth ? 'bg-sage-100 text-sage-700' : 'bg-stone-50 text-stone-400 group-hover:text-sage-600 group-hover:bg-sage-50'}`}>
                {getDepthIcon(config.id)}
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <div className={`font-serif text-[15px] font-medium mb-1 ${config.id === selectedDepth ? 'text-sage-900' : 'text-stone-700'}`}>{config.name}</div>
                <div className="text-xs text-stone-500 leading-relaxed font-medium opacity-80">
                  {config.description}
                </div>
              </div>
            </div>
            {config.id === selectedDepth && (
              <div className="absolute top-3 right-3">
                <div className="w-5 h-5 rounded-full bg-sage-500 flex items-center justify-center text-white shadow-sm">
                  <Check size={10} strokeWidth={3} />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Inline depth indicator for showing current mode
 */
export const DepthIndicator: React.FC<{ depth: DepthLevel }> = ({ depth }) => {
  const config = DEPTH_LEVELS[depth];
  return (
    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100/50 rounded-md border border-stone-200/50">
      <span className="text-sage-600">{getDepthIcon(depth)}</span>
      <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">{config.name}</span>
    </div>
  );
};

export default DepthSelector;
