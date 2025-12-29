import React, { useEffect, useMemo, useState } from 'react';
import { ViewState } from '../types';
import { GitBranch, Clock, Loader2, ChevronLeft, Sparkles } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { ThreadService, type Thread } from '../services/threads';
import { AIService } from '../services/ai';

interface ThreadDetailProps {
  onChangeView: (view: ViewState, data?: any) => void;
  threadId?: string;
}

const ThreadDetail: React.FC<ThreadDetailProps> = ({ onChangeView, threadId }) => {
  const [thread, setThread] = useState<Thread | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!threadId) {
        setThread(null);
        setEntries([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [t, e] = await Promise.all([
          ThreadService.getThread(threadId),
          ThreadService.getThreadEntries(threadId),
        ]);
        setThread(t);
        setEntries(e ?? []);
      } catch (err) {
        console.error('Failed to load thread detail:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [threadId]);

  const lastEntryAt = useMemo(() => {
    const ts = thread?.last_entry_at ?? entries?.[0]?.created_at ?? null;
    return ts ? new Date(ts) : null;
  }, [entries, thread?.last_entry_at]);

  const timeSpanLabel = useMemo(() => {
    if (!entries?.length) return '—';
    const oldest = new Date(entries[entries.length - 1]?.created_at);
    const newest = new Date(entries[0]?.created_at);
    if (Number.isNaN(oldest.getTime()) || Number.isNaN(newest.getTime())) return '—';
    const days = Math.max(0, Math.round((newest.getTime() - oldest.getTime()) / 86_400_000));
    if (days === 0) return 'Today';
    if (days === 1) return '2 Days';
    return `${days + 1} Days`;
  }, [entries]);

  const avgMoodLabel = useMemo(() => {
    const moods: string[] = (entries ?? [])
      .map((e) => (e?.mood ? String(e.mood) : ''))
      .filter(Boolean);
    if (!moods.length) return '—';
    const counts = new Map<string, number>();
    for (const m of moods) counts.set(m, (counts.get(m) ?? 0) + 1);
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  }, [entries]);

  // Generate AI summary for thread
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    const generateSummary = async () => {
      if (!entries.length) return;

      setIsLoadingSummary(true);
      try {
        // Combine entry content for AI analysis
        const combinedContent = entries
          .slice(0, 5) // Limit to recent 5 entries
          .map(e => `${e.title || 'Entry'}: ${(e.content || '').substring(0, 200)}`)
          .join('\n\n');

        const insight = await AIService.getInsight(
          combinedContent,
          thread?.name || 'Thread',
          avgMoodLabel !== '—' ? avgMoodLabel : undefined
        );
        setAiSummary(insight);
      } catch (err) {
        console.error('Failed to generate thread summary:', err);
      } finally {
        setIsLoadingSummary(false);
      }
    };
    generateSummary();
  }, [entries, thread?.name, avgMoodLabel]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-sage animate-spin" />
      </div>
    );
  }

  if (!threadId) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Thread not found"
        description="Select a thread from your Journal to view it here."
        actionLabel="Back to Journal"
        onAction={() => onChangeView(ViewState.JOURNAL)}
        variant="card"
        iconColor="stone"
      />
    );
  }

  if (!thread) {
    return (
      <EmptyState
        icon={GitBranch}
        title="Thread not found"
        description="This thread may have been deleted or you may not have access."
        actionLabel="Back to Journal"
        onAction={() => onChangeView(ViewState.JOURNAL)}
        variant="card"
        iconColor="stone"
      />
    );
  }

  return (
    <div className="animate-fade-up max-w-4xl mx-auto space-y-8 pb-20">

      {/* Header */}
      <div className="glass-card rounded-[32px] p-8 lg:p-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-sage-subtle text-sage flex items-center justify-center shadow-glow">
              <GitBranch size={32} strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => onChangeView(ViewState.JOURNAL)}
                  className="w-10 h-10 rounded-full bg-dark-surface border border-dark-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-sage-border transition-all"
                  title="Back to Journal"
                >
                  <ChevronLeft size={18} />
                </button>
                <h2 className="font-serif text-3xl lg:text-4xl text-text-primary">{thread.name}</h2>
              </div>
              <p className="text-text-secondary font-light">{thread.description || 'A thread of connected entries.'}</p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">Last Entry</p>
            <p className="text-text-primary font-medium">
              {lastEntryAt ? lastEntryAt.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 border-t border-dark-border pt-6">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Entries</p>
            <p className="font-serif text-2xl text-text-primary">{entries.length}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Time Span</p>
            <p className="font-serif text-2xl text-text-primary">{timeSpanLabel}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Avg Mood</p>
            <p className="font-serif text-2xl text-text-primary">{avgMoodLabel}</p>
          </div>
        </div>

        {/* AI Summary */}
        {(aiSummary || isLoadingSummary) && (
          <div className="mt-6 pt-6 border-t border-dark-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-sage" />
              <span className="text-xs font-bold text-sage uppercase tracking-widest">Thread Insight</span>
              <span className="px-1.5 py-0.5 rounded-md bg-sage-subtle text-[9px] font-bold text-sage uppercase tracking-wide border border-sage-border">
                AI
              </span>
            </div>
            {isLoadingSummary ? (
              <div className="flex items-center gap-2 text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Generating insight...</span>
              </div>
            ) : (
              <p className="font-serif text-lg text-text-primary leading-relaxed">
                "{aiSummary}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative pl-12">
        {/* Continuous timeline rail */}
        {entries.length > 1 && (
          <div
            className="absolute left-5 top-6 bottom-10 w-px bg-dark-border"
            aria-hidden="true"
          />
        )}

        {entries.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title="No entries in this thread"
            description="Add your first entry to start building this thread."
            actionLabel="Add to Thread"
            onAction={() => onChangeView(ViewState.EDITOR, { threadId, returnTo: ViewState.THREAD_DETAIL, returnToData: { id: threadId } })}
            variant="card"
            iconColor="sage"
          />
        ) : (
          entries.map((entry, index) => (
            <div key={entry.id} className="relative pb-10 last:pb-0 group">
              {/* Node */}
              <div
                className={`absolute left-5 top-7 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-dark-base ${index === 0 ? 'bg-sage shadow-glow' : 'bg-text-muted'}`}
                aria-hidden="true"
              />

              <div className="pl-2">
                <div
                  onClick={() => onChangeView(ViewState.EDITOR, { entryId: entry.id, returnTo: ViewState.THREAD_DETAIL, returnToData: { id: threadId } })}
                  className="glass-card p-6 lg:p-8 rounded-[24px] hover:shadow-glow hover:border-sage-border transition-all cursor-pointer"
                >
                  <div className="flex gap-4 mb-3">
                    <span className="text-xs font-bold text-sage uppercase tracking-wide bg-sage-subtle px-2 py-1 rounded-md border border-sage-border">
                      {new Date(entry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs font-medium text-text-muted flex items-center gap-1">
                      <Clock size={12} /> {new Date(entry.created_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl text-text-primary mb-3 group-hover:text-sage transition-colors">
                    {entry.title || 'Untitled'}
                  </h4>
                  <p className="text-text-secondary text-sm leading-relaxed font-light line-clamp-2">
                    {(entry.content || '').substring(0, 180)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => onChangeView(ViewState.EDITOR, { threadId, returnTo: ViewState.THREAD_DETAIL, returnToData: { id: threadId } })}
          className="bg-sage text-white px-8 py-3 rounded-full font-medium shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5 transition-all"
        >
          Add to Thread
        </button>
      </div>
    </div>
  );
};

export default ThreadDetail;