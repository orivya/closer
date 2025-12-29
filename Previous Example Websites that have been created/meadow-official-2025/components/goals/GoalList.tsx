/**
 * GoalList Component
 * List of goals with optional drag-and-drop reordering
 */

import React, { useState, useCallback } from 'react';
import { GoalWithIntention } from '../../types/goals';
import { GoalItem } from './GoalItem';
import { CheckCircle2, Circle, Target } from 'lucide-react';

interface GoalListProps {
  goals: GoalWithIntention[];
  onToggle: (goalId: string) => void;
  onEdit?: (goalId: string) => void;
  onDelete?: (goalId: string) => void;
  onLinkIntention?: (goalId: string) => void;
  onReorder?: (goalIds: string[]) => void;
  showCompleted?: boolean;
  emptyMessage?: string;
  compact?: boolean;
}

export const GoalList: React.FC<GoalListProps> = ({
  goals,
  onToggle,
  onEdit,
  onDelete,
  onLinkIntention,
  onReorder,
  showCompleted = true,
  emptyMessage = 'No goals yet. Add one to get started.',
  compact = false,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  const handleDragStart = useCallback(
    (e: React.DragEvent, goalId: string) => {
      if (!onReorder) return;
      setDraggedId(goalId);
      e.dataTransfer.effectAllowed = 'move';
    },
    [onReorder]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, goalId: string) => {
      if (!onReorder || !draggedId || draggedId === goalId) return;
      e.preventDefault();
      setDragOverId(goalId);
    },
    [onReorder, draggedId]
  );

  const handleDragEnd = useCallback(() => {
    if (!onReorder || !draggedId || !dragOverId || draggedId === dragOverId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    // Calculate new order
    const activeIds = activeGoals.map((g) => g.id);
    const draggedIndex = activeIds.indexOf(draggedId);
    const dropIndex = activeIds.indexOf(dragOverId);

    if (draggedIndex !== -1 && dropIndex !== -1) {
      const newOrder = [...activeIds];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedId);
      onReorder(newOrder);
    }

    setDraggedId(null);
    setDragOverId(null);
  }, [onReorder, draggedId, dragOverId, activeGoals]);

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-stone-400">
        <div className="w-16 h-16 rounded-2xl bg-sage-50 flex items-center justify-center mb-4">
          <Target size={28} className="text-sage-400" />
        </div>
        <p className="text-sm text-center max-w-xs">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-3">
          {!compact && activeGoals.length > 0 && completedGoals.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium px-1">
              <Circle size={12} />
              <span>In Progress ({activeGoals.length})</span>
            </div>
          )}
          <div className="space-y-2">
            {activeGoals.map((goal) => (
              <div
                key={goal.id}
                draggable={!!onReorder}
                onDragStart={(e) => handleDragStart(e, goal.id)}
                onDragOver={(e) => handleDragOver(e, goal.id)}
                onDragEnd={handleDragEnd}
                className={`
                  transition-all duration-150
                  ${draggedId === goal.id ? 'opacity-50 scale-[0.98]' : ''}
                  ${dragOverId === goal.id ? 'transform translate-y-1' : ''}
                `}
              >
                <GoalItem
                  goal={goal}
                  onToggle={onToggle}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLinkIntention={onLinkIntention}
                  compact={compact}
                  draggable={!!onReorder}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed goals */}
      {showCompleted && completedGoals.length > 0 && (
        <div className="space-y-3">
          {!compact && (
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium px-1 pt-2">
              <CheckCircle2 size={12} className="text-sage-500" />
              <span>Completed ({completedGoals.length})</span>
            </div>
          )}
          <div className="space-y-2">
            {completedGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                compact={compact}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalList;
