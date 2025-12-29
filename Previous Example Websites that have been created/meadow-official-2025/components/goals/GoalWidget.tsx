/**
 * GoalWidget Component
 * Compact goal display for Home page
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ChevronRight,
  Target,
  Plus,
  Sparkles,
} from 'lucide-react';
import { GoalWithIntention, CreateGoalRequest } from '../../types/goals';
import { GoalItem } from './GoalItem';
import { QuickAddGoal } from './QuickAddGoal';

interface GoalWidgetProps {
  goals: GoalWithIntention[];
  completedTodayCount?: number;
  isLoading?: boolean;
  onToggle: (goalId: string) => void;
  onAdd: (request: CreateGoalRequest) => Promise<void>;
  onViewAll?: () => void;
  maxItems?: number;
}

export const GoalWidget: React.FC<GoalWidgetProps> = ({
  goals,
  completedTodayCount = 0,
  isLoading = false,
  onToggle,
  onAdd,
  onViewAll,
  maxItems = 5,
}) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const displayGoals = goals.slice(0, maxItems);
  const hasMore = goals.length > maxItems;

  // Celebration state for completing goals
  const [showCelebration, setShowCelebration] = useState(false);
  const [prevCompletedCount, setPrevCompletedCount] = useState(completedTodayCount);

  useEffect(() => {
    if (completedTodayCount > prevCompletedCount && prevCompletedCount > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 2000);
      return () => clearTimeout(timer);
    }
    setPrevCompletedCount(completedTodayCount);
  }, [completedTodayCount, prevCompletedCount]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-stone-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
            <Target size={18} className="text-sage-600" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-700">Goals</h3>
            {goals.length > 0 && (
              <p className="text-xs text-stone-400">{goals.length} active</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Completed today badge */}
          {completedTodayCount > 0 && (
            <div
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                ${showCelebration
                  ? 'bg-sage-100 text-sage-600 animate-pulse'
                  : 'bg-stone-100 text-stone-500'
                }
              `}
            >
              <CheckCircle2 size={12} />
              {completedTodayCount} done
              {showCelebration && <Sparkles size={12} className="text-amber-500" />}
            </div>
          )}

          {/* Add button */}
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="p-2 text-stone-400 hover:text-sage-600 hover:bg-sage-50 rounded-xl transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Quick add */}
      {showQuickAdd && (
        <div className="px-5 py-4 border-b border-stone-100 bg-stone-50/50">
          <QuickAddGoal
            onAdd={onAdd}
            autoFocus
            compact
            onCancel={() => setShowQuickAdd(false)}
          />
        </div>
      )}

      {/* Content */}
      <div className="px-5 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-stone-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : displayGoals.length === 0 ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-sage-50 flex items-center justify-center">
              <CheckCircle2 size={26} className="text-sage-400" />
            </div>
            <p className="text-sm text-stone-500 mb-4">All caught up!</p>
            <button
              onClick={() => setShowQuickAdd(true)}
              className="text-sm text-sage-600 hover:text-sage-700 font-medium inline-flex items-center gap-1"
            >
              <Plus size={14} />
              Add a goal
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {displayGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggle={onToggle}
                compact
              />
            ))}
          </div>
        )}
      </div>

      {/* View all footer */}
      {(hasMore || goals.length > 0) && onViewAll && (
        <button
          onClick={onViewAll}
          className="w-full px-5 py-4 flex items-center justify-center gap-1.5 text-sm font-medium text-stone-500 hover:text-sage-600 hover:bg-stone-50 border-t border-stone-100 transition-colors"
        >
          View all goals
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
};

export default GoalWidget;
