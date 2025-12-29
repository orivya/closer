import React from 'react';
import { ExtractedInsight, LensState } from '../../types/essence';
import {
  X,
  Lightbulb,
  Target,
  ArrowRightLeft,
  Link2,
  Eye,
  CheckSquare,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface LensPanelProps {
  lensState: LensState;
  onClose: () => void;
  onSaveInsight: (insight: ExtractedInsight) => void;
  onExploreInsight: (insight: ExtractedInsight) => void;
  isLoading?: boolean;
}

/**
 * Lens Panel
 * Real-time insight panel that appears during Essence conversations
 * Shows: Summary, Focus, Shift, Threads, Blind Spots, Actions
 */
export const LensPanel: React.FC<LensPanelProps> = ({
  lensState,
  onClose,
  onSaveInsight,
  onExploreInsight,
  isLoading = false,
}) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>('summary');

  const hasAnyContent = lensState.summary || lensState.focus || lensState.shift ||
    lensState.threads.length > 0 || lensState.blindSpots.length > 0 || lensState.actions.length > 0;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <aside className="w-80 h-full bg-white border-l border-stone-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-sage-500" />
          <h3 className="font-medium text-stone-800 text-sm">Lens</h3>
          {lensState.insightCount > 0 && (
            <span className="px-1.5 py-0.5 bg-sage-100 text-sage-600 text-[10px] font-medium rounded-full">
              {lensState.insightCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="w-8 h-8 border-2 border-sage-200 border-t-sage-500 rounded-full animate-spin mb-3" />
            <p className="text-sm text-stone-500">Listening for insights...</p>
          </div>
        ) : !hasAnyContent ? (
          <div className="p-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80">
              <p className="text-sm text-stone-500 leading-relaxed">
                As we talk, I'll surface themes, patterns, and moments of clarity here.
              </p>
              <p className="text-xs text-stone-400 mt-2">
                Keep going... insights will appear as they emerge.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            {/* Summary - What We've Touched On */}
            {lensState.summary && (
              <InsightSection
                icon={<Lightbulb size={14} />}
                title="What We've Touched On"
                isExpanded={expandedSection === 'summary'}
                onToggle={() => toggleSection('summary')}
              >
                <p className="text-sm text-stone-600 leading-relaxed">
                  {lensState.summary}
                </p>
              </InsightSection>
            )}

            {/* Focus - The Heart of It */}
            {lensState.focus && (
              <InsightSection
                icon={<Target size={14} />}
                title="The Heart of It"
                isExpanded={expandedSection === 'focus'}
                onToggle={() => toggleSection('focus')}
                accentColor="sage"
              >
                <InsightCard
                  insight={lensState.focus}
                  onSave={() => onSaveInsight(lensState.focus!)}
                  onExplore={() => onExploreInsight(lensState.focus!)}
                />
              </InsightSection>
            )}

            {/* Shift - A Movement */}
            {lensState.shift && (
              <InsightSection
                icon={<ArrowRightLeft size={14} />}
                title="A Movement"
                isExpanded={expandedSection === 'shift'}
                onToggle={() => toggleSection('shift')}
                accentColor="amber"
              >
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-stone-100">
                    <div className="text-[10px] uppercase tracking-wide text-stone-400 mb-1">Before</div>
                    <p className="text-sm text-stone-600">{lensState.shift.before}</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRightLeft size={14} className="text-stone-300" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-sage-50 border border-sage-100">
                    <div className="text-[10px] uppercase tracking-wide text-sage-500 mb-1">After</div>
                    <p className="text-sm text-sage-700">{lensState.shift.after}</p>
                  </div>
                </div>
              </InsightSection>
            )}

            {/* Threads - Worth Holding */}
            {lensState.threads.length > 0 && (
              <InsightSection
                icon={<Link2 size={14} />}
                title="Threads Worth Holding"
                isExpanded={expandedSection === 'threads'}
                onToggle={() => toggleSection('threads')}
                count={lensState.threads.length}
              >
                <div className="space-y-2">
                  {lensState.threads.map((thread, i) => (
                    <InsightCard
                      key={i}
                      insight={thread}
                      onSave={() => onSaveInsight(thread)}
                      onExplore={() => onExploreInsight(thread)}
                      compact
                    />
                  ))}
                </div>
              </InsightSection>
            )}

            {/* Blind Spots - Something Unexplored */}
            {lensState.blindSpots.length > 0 && (
              <InsightSection
                icon={<Eye size={14} />}
                title="Something Unexplored"
                isExpanded={expandedSection === 'blindSpots'}
                onToggle={() => toggleSection('blindSpots')}
                accentColor="purple"
                count={lensState.blindSpots.length}
              >
                <div className="space-y-2">
                  {lensState.blindSpots.map((spot, i) => (
                    <InsightCard
                      key={i}
                      insight={spot}
                      onSave={() => onSaveInsight(spot)}
                      onExplore={() => onExploreInsight(spot)}
                      compact
                      variant="blindSpot"
                    />
                  ))}
                </div>
              </InsightSection>
            )}

            {/* Actions - Next Steps */}
            {lensState.actions.length > 0 && (
              <InsightSection
                icon={<CheckSquare size={14} />}
                title="Next Steps"
                isExpanded={expandedSection === 'actions'}
                onToggle={() => toggleSection('actions')}
                count={lensState.actions.length}
              >
                <div className="space-y-1.5">
                  {lensState.actions.map((action, i) => (
                    <ActionItem key={i} action={action} />
                  ))}
                </div>
              </InsightSection>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {hasAnyContent && (
        <div className="p-3 border-t border-stone-100 bg-stone-50/50">
          <p className="text-[10px] text-stone-400 text-center">
            Star insights to save them. Explore to dive deeper.
          </p>
        </div>
      )}
    </aside>
  );
};

/**
 * Collapsible section wrapper
 */
interface InsightSectionProps {
  icon: React.ReactNode;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  accentColor?: 'sage' | 'amber' | 'purple';
  count?: number;
  children: React.ReactNode;
}

const InsightSection: React.FC<InsightSectionProps> = ({
  icon,
  title,
  isExpanded,
  onToggle,
  accentColor,
  count,
  children,
}) => {
  const accentColors = {
    sage: 'text-sage-500',
    amber: 'text-amber-500',
    purple: 'text-purple-500',
  };

  return (
    <div className="rounded-xl bg-stone-50/50 border border-stone-200/60 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-stone-100/50 transition-colors"
      >
        <span className={accentColor ? accentColors[accentColor] : 'text-stone-400'}>
          {icon}
        </span>
        <span className="flex-1 text-xs font-medium text-stone-700">{title}</span>
        {count !== undefined && count > 0 && (
          <span className="px-1.5 py-0.5 bg-stone-200 text-stone-500 text-[9px] font-medium rounded-full">
            {count}
          </span>
        )}
        {isExpanded ? (
          <ChevronUp size={12} className="text-stone-400" />
        ) : (
          <ChevronDown size={12} className="text-stone-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Individual insight card
 */
interface InsightCardProps {
  insight: ExtractedInsight;
  onSave: () => void;
  onExplore: () => void;
  compact?: boolean;
  variant?: 'default' | 'blindSpot';
}

const InsightCard: React.FC<InsightCardProps> = ({
  insight,
  onSave,
  onExplore,
  compact = false,
  variant = 'default',
}) => {
  const bgClass = variant === 'blindSpot'
    ? 'bg-purple-50 border-purple-100'
    : 'bg-white border-stone-200';

  return (
    <div className={`p-2.5 rounded-lg border ${bgClass}`}>
      <p className={`text-stone-600 leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
        {insight.content}
      </p>
      {insight.context && (
        <p className="text-[10px] text-stone-400 mt-1.5 italic">
          "{insight.context}"
        </p>
      )}
      <div className="flex gap-1.5 mt-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-stone-500 hover:text-sage-600 hover:bg-sage-50 rounded transition-colors"
        >
          <Star size={10} />
          Save
        </button>
        <button
          onClick={onExplore}
          className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-stone-500 hover:text-sage-600 hover:bg-sage-50 rounded transition-colors"
        >
          <Sparkles size={10} />
          Explore
        </button>
      </div>
    </div>
  );
};

/**
 * Action item with add-to-todo button
 */
const ActionItem: React.FC<{ action: string }> = ({ action }) => {
  const [added, setAdded] = React.useState(false);

  const handleAdd = () => {
    setAdded(true);
    // TODO: Actually add to todos
  };

  return (
    <div className="flex items-start gap-2 p-2 rounded-lg bg-white border border-stone-200">
      <button
        onClick={handleAdd}
        disabled={added}
        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          added
            ? 'bg-sage-500 border-sage-500 text-white'
            : 'border-stone-300 hover:border-sage-400'
        }`}
      >
        {added && <CheckSquare size={10} />}
      </button>
      <p className={`text-xs text-stone-600 leading-relaxed ${added ? 'line-through opacity-50' : ''}`}>
        {action}
      </p>
    </div>
  );
};

export default LensPanel;
