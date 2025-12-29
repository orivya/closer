'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Edit2, Trash2, Star } from 'lucide-react';
import { PortfolioItem } from '@/hooks/usePortfolioItems';
import { cn } from '@/lib/utils';

interface PortfolioListWithDndProps {
  items: PortfolioItem[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (items: PortfolioItem[]) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
}

function SortablePortfolioItem({
  item,
  onEdit,
  onDelete,
  onToggleFeatured,
}: {
  item: PortfolioItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, isFeatured: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-[var(--bg-elevated)] border border-[var(--border-dark)] rounded-2xl overflow-hidden transition-all',
        isDragging && 'opacity-50 scale-95'
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-[var(--text-muted)] hover:text-white cursor-move p-1"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        {/* Cover Image */}
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-card)] flex-shrink-0">
          {item.cover_image_url ? (
            <img
              src={item.cover_image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-xl">
              {item.title[0]}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold truncate">{item.title}</h3>
            {item.is_featured && (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] truncate">{item.artist}</p>
          {item.genre && (
            <p className="text-xs text-[var(--text-muted)] mt-1">{item.genre}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFeatured(item.id, !item.is_featured)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              item.is_featured
                ? 'text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20'
                : 'text-[var(--text-muted)] hover:text-yellow-400 hover:bg-yellow-400/10'
            )}
            title={item.is_featured ? 'Remove from featured' : 'Mark as featured'}
          >
            <Star className={cn('w-4 h-4', item.is_featured && 'fill-yellow-400')} />
          </button>
          <button
            onClick={() => onEdit(item.id)}
            className="p-2 text-[var(--text-muted)] hover:text-white hover:bg-[var(--bg-card)] rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function PortfolioListWithDnd({
  items,
  onEdit,
  onDelete,
  onReorder,
  onToggleFeatured,
}: PortfolioListWithDndProps) {
  const [localItems, setLocalItems] = useState(items);

  React.useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localItems.findIndex((item) => item.id === active.id);
      const newIndex = localItems.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(localItems, oldIndex, newIndex);
      setLocalItems(newItems);
      onReorder(newItems);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full h-64 border-2 border-dashed border-[var(--border-dark)] rounded-3xl flex flex-col items-center justify-center text-[var(--text-muted)]">
        <p className="font-medium">No portfolio items yet</p>
        <p className="text-sm mt-1">Click "Add Portfolio Item" to get started</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={localItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {localItems.map((item) => (
            <SortablePortfolioItem
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleFeatured={onToggleFeatured}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
