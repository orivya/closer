/**
 * GoalItem Component
 * Individual goal item with checkbox, content, and actions
 */

import React, { useState } from 'react';
import {
  Check,
  MoreHorizontal,
  Trash2,
  Edit2,
  Link,
  Calendar,
  Flag,
} from 'lucide-react';
import {
  GoalWithIntention,
  GOAL_PRIORITY_COLORS,
  GOAL_PRIORITY_LABELS,
} from '../../types/goals';

interface GoalItemProps {
  goal: GoalWithIntention;
  onToggle: (goalId: string) => void;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onLinkIntention?: (goalId: string) => void;
  compact?: boolean;
  draggable?: boolean;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onToggle,
  onEdit,
  onDelete,
  onLinkIntention,
  compact = false,
  draggable = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const priorityColor = goal.priority
    ? GOAL_PRIORITY_COLORS[goal.priority]
    : undefined;

  const formatDueDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return due.toLocaleDateString('en-US', { weekday: 'short' });
    return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = goal.dueDate && new Date(goal.dueDate) < new Date() && !goal.completed;

  return (
    <div
      className={`
        group relative flex items-start gap-4 p-5 rounded-2xl transition-all duration-300
        ${goal.completed ? 'bg-white/40 border-stone-100/60' : 'bg-white border-stone-100 shadow-sm hover:shadow-md hover:border-sage-200'}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        ${compact ? 'py-3' : 'py-5'}
        border
      `}
    >
      {/* Checkbox - Refined */}
      <button
        onClick={() => onToggle(goal.id)}
        className={`
          flex-shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 transition-all duration-300
          flex items-center justify-center relative overflow-hidden group/checkbox
          ${goal.completed
            ? 'bg-sage-500 border-sage-500 text-white'
            : 'border-stone-200 hover:border-sage-400 bg-white'
          }
        `}
      >
        <Check
          size={14}
          strokeWidth={2.5}
          className={`transition-all duration-300 ${goal.completed ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover/checkbox:scale-75 group-hover/checkbox:opacity-20 group-hover/checkbox:text-sage-400'}`}
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className={`
            text-[15px] leading-relaxed font-medium transition-all duration-300
            ${goal.completed ? 'text-stone-400/80 line-through' : 'text-stone-700'}
          `}
        >
          {goal.content}
        </p>

        {/* Meta row */}
        {!compact && (goal.intention || goal.dueDate || goal.priority) && (
          <div className={`flex flex-wrap items-center gap-3 mt-2.5 transition-opacity ${goal.completed ? 'opacity-50' : 'opacity-100'}`}>
            {/* Intention badge */}
            {goal.intention && (
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${goal.intention.color}15`,
                  color: goal.intention.color,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: goal.intention.color }}
                />
                {goal.intention.title}
              </span>
            )}

            {/* Due date */}
            {goal.dueDate && (
              <span
                className={`
                  inline-flex items-center gap-1.5 text-[11px] font-medium
                  ${isOverdue ? 'text-red-500' : 'text-stone-400'}
                `}
              >
                <Calendar size={12} strokeWidth={isOverdue ? 2 : 1.5} />
                {formatDueDate(new Date(goal.dueDate))}
              </span>
            )}

            {/* Priority flag */}
            {goal.priority && (
              <span
                className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-400"
              >
                <Flag size={12} strokeWidth={1.5} style={{ color: priorityColor }} />
                {GOAL_PRIORITY_LABELS[goal.priority]}
              </span>
            )}
          </div>
        )}

        {/* Notes */}
        {!compact && goal.notes && (
          <p className="mt-2 text-xs text-stone-400 line-clamp-2 font-light italic">{goal.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200">
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 text-stone-300 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-colors"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-stone-100 py-1 min-w-[160px] animate-in fade-in zoom-in-95 duration-150">
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(goal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-3"
                  >
                    <Edit2 size={14} />
                    Edit goal
                  </button>
                )}
                {onLinkIntention && (
                  <button
                    onClick={() => {
                      onLinkIntention(goal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-3"
                  >
                    <Link size={14} />
                    Link intention
                  </button>
                )}
                <div className="my-1 h-px bg-stone-100" />
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(goal.id);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-3"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalItem;
