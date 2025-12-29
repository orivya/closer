import React from 'react';
import { LucideIcon, BookOpen, Sparkles, TrendingUp, Calendar, Target, Search, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'minimal' | 'card';
  iconColor?: 'sage' | 'clay' | 'stone';
}

const iconColorClasses = {
  sage: 'text-sage bg-sage-subtle border border-sage-border',
  clay: 'text-clay bg-clay/10 border border-clay/20',
  stone: 'text-text-muted bg-dark-surface border border-dark-border',
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  variant = 'default',
  iconColor = 'sage',
}) => {
  const containerClasses = {
    default: 'py-16 px-8',
    minimal: 'py-8 px-4',
    card: 'py-12 px-6 bg-dark-card/60 backdrop-blur-sm rounded-3xl border border-dark-border',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${containerClasses[variant]} animate-fade-up`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${iconColorClasses[iconColor]}`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary max-w-sm mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-sage text-white rounded-2xl font-medium shadow-glow hover:shadow-glow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Pre-configured empty states for common scenarios
export const JournalEmptyState: React.FC<{ onStartWriting: () => void }> = ({ onStartWriting }) => (
  <EmptyState
    icon={BookOpen}
    title="Your journal awaits"
    description="Start your journaling journey by writing your first entry. Every story begins with a single thought."
    actionLabel="Write Your First Entry"
    onAction={onStartWriting}
    iconColor="sage"
  />
);

export const InsightsEmptyState: React.FC = () => (
  <EmptyState
    icon={TrendingUp}
    title="Insights are brewing"
    description="Keep journaling! After a few more entries, we'll be able to show you patterns and insights about your journey."
    iconColor="clay"
  />
);

export const SearchEmptyState: React.FC<{ query: string }> = ({ query }) => (
  <EmptyState
    icon={Search}
    title="No results found"
    description={`We couldn't find any entries matching "${query}". Try adjusting your search or filters.`}
    variant="minimal"
    iconColor="stone"
  />
);

export const MemoriesEmptyState: React.FC = () => (
  <EmptyState
    icon={Calendar}
    title="No memories yet"
    description="Your TimeVault will fill with precious memories as you continue your journaling journey."
    iconColor="sage"
  />
);

export const IntentionsEmptyState: React.FC<{ onCreateIntention: () => void }> = ({ onCreateIntention }) => (
  <EmptyState
    icon={Target}
    title="Set your first intention"
    description="Intentions help you focus on what matters most. Start by setting a meaningful goal for yourself."
    actionLabel="Create Intention"
    onAction={onCreateIntention}
    iconColor="clay"
  />
);

export const PromptsEmptyState: React.FC = () => (
  <EmptyState
    icon={Sparkles}
    title="Prompts loading..."
    description="We're preparing some thoughtful prompts to inspire your writing."
    variant="minimal"
    iconColor="sage"
  />
);

export default EmptyState;
