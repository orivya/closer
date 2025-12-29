/**
 * Goals View
 * Full-featured goal management page with clean, sage-themed design
 */

import React, { useState } from 'react';
import { ViewState, Intention } from '../types';
import {
  GoalWithIntention,
  GoalFilters,
  GoalFilterBy,
  CreateGoalRequest,
} from '../types/goals';
import { GoalList, QuickAddGoal } from '../components/goals';
import {
  Target,
  Filter,
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface GoalsProps {
  onChangeView: (view: ViewState, params?: Record<string, string>) => void;
}

// Mock data for development
const MOCK_INTENTIONS: Intention[] = [
  { id: '1', title: 'Save for house', description: '', category: 'finance', status: 'active', entryCount: 5 },
  { id: '2', title: 'Get promoted', description: '', category: 'career', status: 'active', entryCount: 3 },
  { id: '3', title: 'Run a marathon', description: '', category: 'health', status: 'active', entryCount: 8 },
];

const MOCK_GOALS: GoalWithIntention[] = [
  {
    id: '1',
    userId: 'user1',
    content: 'Review monthly budget spreadsheet',
    completed: false,
    source: 'manual',
    sortOrder: 1,
    priority: 1,
    dueDate: new Date(),
    intentionId: '1',
    intention: { id: '1', title: 'Save for house', color: '#F59E0B' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    userId: 'user1',
    content: 'Schedule one-on-one with manager',
    completed: false,
    source: 'essence',
    sortOrder: 2,
    priority: 2,
    intentionId: '2',
    intention: { id: '2', title: 'Get promoted', color: '#3B82F6' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: 'user1',
    content: 'Complete 5K training run',
    completed: false,
    source: 'manual',
    sortOrder: 3,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    intentionId: '3',
    intention: { id: '3', title: 'Run a marathon', color: '#10B981' },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    userId: 'user1',
    content: 'Write in journal about career goals',
    completed: false,
    source: 'insight',
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    userId: 'user1',
    content: 'Research investment options',
    completed: true,
    completedAt: new Date(),
    source: 'manual',
    sortOrder: 5,
    intentionId: '1',
    intention: { id: '1', title: 'Save for house', color: '#F59E0B' },
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(),
  },
];

const FILTER_OPTIONS: { id: GoalFilterBy; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <Target size={14} /> },
  { id: 'today', label: 'Due Today', icon: <Calendar size={14} /> },
  { id: 'overdue', label: 'Overdue', icon: <AlertCircle size={14} /> },
  { id: 'no-date', label: 'No Date', icon: <Clock size={14} /> },
  { id: 'by-intention', label: 'By Intention', icon: <Flag size={14} /> },
];

const Goals: React.FC<GoalsProps> = ({ onChangeView }) => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalWithIntention[]>(MOCK_GOALS);
  const [intentions] = useState<Intention[]>(MOCK_INTENTIONS);
  const [filters, setFilters] = useState<GoalFilters>({
    filterBy: 'all',
    showCompleted: true,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Stats
  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const overdueGoals = activeGoals.filter(
    (g) => g.dueDate && new Date(g.dueDate) < new Date()
  );
  const todayGoals = activeGoals.filter((g) => {
    if (!g.dueDate) return false;
    const today = new Date();
    const due = new Date(g.dueDate);
    return (
      due.getDate() === today.getDate() &&
      due.getMonth() === today.getMonth() &&
      due.getFullYear() === today.getFullYear()
    );
  });

  // Timeframe grouping helper
  const getTimeframe = (date?: Date): string => {
    if (!date) return 'Someday / Long Term';
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7 && diffDays >= 0) return 'This Week'; // Include today and future 6 days
    if (diffDays <= 30 && diffDays > 7) return 'This Month';
    if (diffDays <= 90 && diffDays > 30) return 'This Quarter';
    if (diffDays < 0) return 'Overdue'; // Add overdue as a timeframe
    return 'Long Term';
  };

  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const getFilteredGoals = () => {
    let filtered = goals.filter((g) => {
      if (activeTab === 'active') return !g.completed;
      return g.completed;
    });
    // Sort by timeframe roughly (no date last for active, first for completed?)
    // Actually simplicity: Just return them, we will group in render
    return filtered.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  };

  const handleToggle = (goalId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const completed = !g.completed;
        return {
          ...g,
          completed,
          completedAt: completed ? new Date() : undefined
        };
      }
      return g;
    }));
  };

  const handleAdd = async (request: CreateGoalRequest) => {
    const newGoal: GoalWithIntention = {
      id: Date.now().toString(),
      userId: user?.id || 'user1',
      content: request.content,
      completed: false,
      source: request.source || 'manual',
      sortOrder: goals.length + 1,
      completedAt: undefined,
      dueDate: request.dueDate ? new Date(request.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
      intentionId: request.intentionId,
      intention: request.intentionId
        ? intentions.find((i) => i.id === request.intentionId)
        : undefined,
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const handleDelete = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const handleReorder = (goalIds: string[]) => {
    setGoals((prev) => {
      const reordered = goalIds.map((id, index) => {
        const goal = prev.find((g) => g.id === id);
        return goal ? { ...goal, sortOrder: index + 1 } : null;
      }).filter(Boolean) as GoalWithIntention[];

      // Keep goals that weren't in the reordered list (if any)
      const others = prev.filter(g => !goalIds.includes(g.id));
      return [...reordered, ...others];
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'career': return '#7FA1C3'; // Muted Blue
      case 'finance': return '#D4AF37'; // Soft Gold
      case 'health': return '#E07A5F'; // Terracotta
      case 'relationships': return '#E1BC91'; // Warm Sand
      case 'growth': return '#7D9B8A'; // Sage
      default: return '#A8A29E'; // Stone
    }
  };

  const filteredGoals = getFilteredGoals();

  return (
    <div className="flex flex-col h-full w-full bg-[#faf9f7] overflow-hidden">
      {/* Header */}
      <header className="px-8 pt-8 pb-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-sage-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest text-sage-400">Focus</p>
          </div>
          <h1 className="font-serif text-[2.5rem] font-normal text-sage-900 leading-[1.1]">
            Your Goals
          </h1>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            p-2.5 rounded-full transition-all duration-200 border
            ${showFilters
              ? 'bg-sage-100 text-sage-700 border-sage-200'
              : 'bg-white text-stone-400 border-stone-200 hover:border-sage-300 hover:text-sage-600'
            }
          `}
        >
          <Filter size={20} strokeWidth={1.5} />
        </button>
      </header>

      {/* Stats bar */}
      <div className="px-8 pb-6 flex gap-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-stone-200 text-sm shadow-sm">
          <CheckCircle2 size={16} className="text-sage-500" strokeWidth={2} />
          <span className="text-stone-600 font-medium">{completedGoals.length} <span className="text-stone-400 font-normal">done</span></span>
        </div>

        {todayGoals.length > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-stone-200 text-sm shadow-sm group hover:border-amber-200 transition-colors">
            <Calendar size={16} className="text-amber-500" strokeWidth={2} />
            <span className="text-stone-600 font-medium group-hover:text-amber-700 transition-colors">{todayGoals.length} <span className="text-stone-400 font-normal group-hover:text-amber-600/70">due today</span></span>
          </div>
        )}

        {overdueGoals.length > 0 && (
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white rounded-full border border-stone-200 text-sm shadow-sm group hover:border-red-200 transition-colors">
            <AlertCircle size={16} className="text-red-500" strokeWidth={2} />
            <span className="text-stone-600 font-medium group-hover:text-red-700 transition-colors">{overdueGoals.length} <span className="text-stone-400 font-normal group-hover:text-red-600/70">overdue</span></span>
          </div>
        )}
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="px-8 pb-6 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-stone-50 rounded-2xl p-1.5 flex flex-wrap gap-1">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.id}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    filterBy: option.id,
                    intentionId: option.id === 'by-intention' ? prev.intentionId : undefined,
                  }))
                }
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${filters.filterBy === option.id
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100/50'
                  }
                  `}
              >
                {React.cloneElement(option.icon as React.ReactElement, {
                  size: 16,
                  strokeWidth: 1.5,
                  className: filters.filterBy === option.id ? 'text-sage-500' : 'text-stone-400'
                })}
                {option.label}
              </button>
            ))}
          </div>

          {/* Intention selector (when filter is by-intention) */}
          {filters.filterBy === 'by-intention' && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <p className="text-xs font-bold text-stone-400 mb-2 uppercase tracking-widest pl-1">Filter by Intention</p>
              <div className="flex flex-wrap gap-2">
                {intentions.map((intention) => (
                  <button
                    key={intention.id}
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        intentionId: prev.intentionId === intention.id ? undefined : intention.id,
                      }))
                    }
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                      ${filters.intentionId === intention.id
                        ? 'bg-sage-50 border-sage-200 text-sage-900'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                      }
                    `}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getCategoryColor(intention.category) }}
                    />
                    {intention.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show completed toggle */}
          <div className="flex items-center gap-3 mt-4 pl-1">
            <div className="relative flex items-center">
              <input
                type="checkbox"
                id="showCompleted"
                checked={filters.showCompleted}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, showCompleted: e.target.checked }))
                }
                className="peer h-4 w-4 shrink-0 rounded-full border-2 border-stone-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-sage-500 checked:border-sage-500 appearance-none transition-all cursor-pointer"
              />
              <Check size={10} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
            </div>
            <label htmlFor="showCompleted" className="text-sm font-medium text-stone-600 cursor-pointer select-none">
              Show completed goals
            </label>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Quick add */}
          <QuickAddGoal
            onAdd={handleAdd}
            placeholder="What's your next goal?"
          />

          {/* Goal list */}
          <GoalList
            goals={filteredGoals}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onReorder={handleReorder}
            showCompleted={filters.showCompleted}
            emptyMessage={
              filters.filterBy === 'all'
                ? "You're all set! Add a goal to get started."
                : `No goals matching "${FILTER_OPTIONS.find((o) => o.id === filters.filterBy)?.label}"`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Goals;
