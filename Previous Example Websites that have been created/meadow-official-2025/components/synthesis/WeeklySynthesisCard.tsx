/**
 * WeeklySynthesisCard Component
 * Displays a weekly synthesis/recap
 */

import React, { useState } from 'react';
import {
  Calendar,
  ChevronRight,
  BookOpen,
  MessageCircle,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Sparkles,
  Heart,
  Target,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WeeklySynthesis, SynthesisTheme } from '../../types/user-context';

interface WeeklySynthesisCardProps {
  synthesis: WeeklySynthesis;
  isLatest?: boolean;
  onView?: () => void;
  compact?: boolean;
}

export const WeeklySynthesisCard: React.FC<WeeklySynthesisCardProps> = ({
  synthesis,
  isLatest = false,
  onView,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(isLatest);

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const getThemeStrengthColor = (strength: number) => {
    if (strength >= 0.7) return 'bg-sage-500';
    if (strength >= 0.4) return 'bg-sage-300';
    return 'bg-sage-200';
  };

  const hasActivity = synthesis.entryCount > 0 || synthesis.sessionCount > 0;

  if (compact) {
    return (
      <div
        onClick={onView}
        className="group glass-card p-4 rounded-xl hover:border-sage-border transition-all cursor-pointer"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Calendar size={18} className="text-sage-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">
                {formatDateRange(synthesis.weekStart, synthesis.weekEnd)}
              </p>
              <p className="text-xs text-stone-400">
                {synthesis.entryCount} entries · {synthesis.sessionCount} sessions
              </p>
            </div>
          </div>
          <ChevronRight
            size={16}
            className="text-stone-300 group-hover:text-sage-500 transition-colors"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        glass-card rounded-2xl overflow-hidden transition-all
        ${isLatest ? 'border-sage-200 shadow-sm' : 'border-stone-100'}
      `}
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer hover:bg-stone-50/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${isLatest ? 'bg-sage-100' : 'bg-stone-100'}
              `}
            >
              <Sparkles
                size={22}
                className={isLatest ? 'text-sage-600' : 'text-stone-500'}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-stone-800">
                  {formatDateRange(synthesis.weekStart, synthesis.weekEnd)}
                </h3>
                {isLatest && (
                  <span className="px-2 py-0.5 rounded-full bg-sage-100 text-sage-700 text-[10px] font-bold uppercase">
                    This Week
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 mt-0.5">
                {hasActivity
                  ? `${synthesis.entryCount} entries · ${synthesis.sessionCount} sessions · ${synthesis.todoCompletedCount} completed`
                  : 'A quiet week for reflection'}
              </p>
            </div>
          </div>
          <button className="p-2 text-stone-400 hover:text-stone-600 rounded-lg transition-colors">
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-5 animate-in slide-in-from-top-2 duration-200">
          {/* Divider */}
          <div className="h-px bg-stone-100" />

          {/* Summary */}
          <div className="bg-sage-50/50 rounded-xl p-4">
            <p className="text-stone-700 leading-relaxed">{synthesis.summary}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-3 bg-stone-50 rounded-xl">
              <BookOpen size={18} className="mx-auto mb-1 text-sage-500" />
              <p className="text-lg font-semibold text-stone-800">{synthesis.entryCount}</p>
              <p className="text-[10px] text-stone-400 uppercase font-medium">Entries</p>
            </div>
            <div className="text-center p-3 bg-stone-50 rounded-xl">
              <MessageCircle size={18} className="mx-auto mb-1 text-sage-500" />
              <p className="text-lg font-semibold text-stone-800">{synthesis.sessionCount}</p>
              <p className="text-[10px] text-stone-400 uppercase font-medium">Sessions</p>
            </div>
            <div className="text-center p-3 bg-stone-50 rounded-xl">
              <Lightbulb size={18} className="mx-auto mb-1 text-amber-500" />
              <p className="text-lg font-semibold text-stone-800">{synthesis.insightCount}</p>
              <p className="text-[10px] text-stone-400 uppercase font-medium">Insights</p>
            </div>
            <div className="text-center p-3 bg-stone-50 rounded-xl">
              <CheckCircle2 size={18} className="mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-semibold text-stone-800">{synthesis.todoCompletedCount}</p>
              <p className="text-[10px] text-stone-400 uppercase font-medium">Done</p>
            </div>
          </div>

          {/* Themes */}
          {synthesis.themes.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-3">
                Themes This Week
              </h4>
              <div className="space-y-2">
                {synthesis.themes.map((theme, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`mt-1.5 w-2 h-2 rounded-full ${getThemeStrengthColor(
                        theme.strength
                      )}`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-700">{theme.name}</p>
                      <p className="text-xs text-stone-500">{theme.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emotional Arc */}
          {synthesis.emotionalArc && (
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Heart size={12} />
                Emotional Journey
              </h4>
              <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-3">
                {synthesis.emotionalArc}
              </p>
            </div>
          )}

          {/* Key Insights */}
          {synthesis.keyInsights.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Lightbulb size={12} />
                Key Insights
              </h4>
              <ul className="space-y-2">
                {synthesis.keyInsights.map((insight, index) => (
                  <li
                    key={index}
                    className="text-sm text-stone-600 pl-4 border-l-2 border-amber-200"
                  >
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Observations */}
          {synthesis.growthObservations.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <TrendingUp size={12} />
                Growth Signals
              </h4>
              <ul className="space-y-1.5">
                {synthesis.growthObservations.map((observation, index) => (
                  <li
                    key={index}
                    className="text-sm text-emerald-600 flex items-center gap-2"
                  >
                    <CheckCircle2 size={12} />
                    {observation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Focus */}
          {synthesis.suggestedFocus && (
            <div className="bg-sage-50 rounded-xl p-4 border border-sage-100">
              <h4 className="text-xs font-bold text-sage-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Target size={12} />
                Focus for Next Week
              </h4>
              <p className="text-sm text-sage-700">{synthesis.suggestedFocus}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklySynthesisCard;
