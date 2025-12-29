import React, { useState, useEffect } from 'react';
import { ArrowLeft, GitBranch, Plus, Sparkles, ChevronRight, FileText, Calendar, TrendingUp } from 'lucide-react';
import { ViewState } from '../../types';
import { ThreadService, Thread } from '../../services/threads';
import { JournalService } from '../../services/journal';

interface ThreadTapestryProps {
  onChangeView: (view: ViewState, data?: any) => void;
}

interface ThreadWithStats extends Thread {
  entryCount: number;
  lastActivity?: string;
  wordCount: number;
}

export default function ThreadTapestry({ onChangeView }: ThreadTapestryProps) {
  const [threads, setThreads] = useState<ThreadWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<ThreadWithStats | null>(null);
  const [threadEntries, setThreadEntries] = useState<any[]>([]);
  const [view, setView] = useState<'overview' | 'detail'>('overview');

  useEffect(() => {
    loadThreadsWithStats();
  }, []);

  const loadThreadsWithStats = async () => {
    setIsLoading(true);
    try {
      const allThreads = await ThreadService.getThreads();
      const entries = await JournalService.getEntries();

      const threadsWithStats: ThreadWithStats[] = allThreads.map(thread => {
        const threadEntriesForThread = entries.filter(e => e.thread === thread.id);
        const totalWords = threadEntriesForThread.reduce((sum, e) => {
          return sum + (e.content?.split(/\s+/).filter((w: string) => w.length > 0).length || 0);
        }, 0);
        const lastEntry = threadEntriesForThread.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        return {
          ...thread,
          entryCount: threadEntriesForThread.length,
          lastActivity: lastEntry?.date,
          wordCount: totalWords,
        };
      });

      // Sort by entry count descending
      threadsWithStats.sort((a, b) => b.entryCount - a.entryCount);
      setThreads(threadsWithStats);
    } catch (error) {
      console.error('Failed to load threads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectThread = async (thread: ThreadWithStats) => {
    setSelectedThread(thread);
    setView('detail');

    try {
      const entries = await JournalService.getEntries();
      const filtered = entries
        .filter(e => e.thread === thread.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setThreadEntries(filtered);
    } catch (error) {
      console.error('Failed to load thread entries:', error);
    }
  };

  const getTotalEntries = () => threads.reduce((sum, t) => sum + t.entryCount, 0);
  const getTotalWords = () => threads.reduce((sum, t) => sum + t.wordCount, 0);
  const getActiveThreads = () => threads.filter(t => t.entryCount > 0).length;

  const formatRelativeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getThreadSize = (entryCount: number) => {
    const maxEntries = Math.max(...threads.map(t => t.entryCount), 1);
    const ratio = entryCount / maxEntries;
    if (ratio > 0.7) return 'large';
    if (ratio > 0.3) return 'medium';
    return 'small';
  };

  return (
    <div className="min-h-screen bg-dark-base pb-28 lg:pb-10">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-dark-base/80 backdrop-blur-md border-b border-dark-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => view === 'detail' ? setView('overview') : onChangeView(ViewState.EXPLORE)}
            className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center hover:bg-dark-card/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="flex-1">
            <h1 className="font-serif text-xl text-text-primary">
              {view === 'detail' && selectedThread ? selectedThread.name : 'Thread Tapestry'}
            </h1>
            <p className="text-xs text-text-secondary">
              {view === 'detail' && selectedThread
                ? `${selectedThread.entryCount} entries`
                : 'Your interconnected narrative'}
            </p>
          </div>
          <GitBranch className="w-8 h-8 text-sage" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sage border-t-transparent rounded-full animate-spin" />
          </div>
        ) : view === 'overview' ? (
          <div className="space-y-6 animate-fade-up">
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card rounded-2xl p-4 text-center">
                <span className="text-2xl font-serif text-text-primary">{threads.length}</span>
                <p className="text-xs text-text-secondary mt-1">Threads</p>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center">
                <span className="text-2xl font-serif text-text-primary">{getTotalEntries()}</span>
                <p className="text-xs text-text-secondary mt-1">Entries</p>
              </div>
              <div className="glass-card rounded-2xl p-4 text-center">
                <span className="text-2xl font-serif text-text-primary">
                  {getTotalWords() > 1000 ? `${(getTotalWords() / 1000).toFixed(1)}k` : getTotalWords()}
                </span>
                <p className="text-xs text-text-secondary mt-1">Words</p>
              </div>
            </div>

            {/* Visual Tapestry */}
            {threads.length > 0 ? (
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-sage mb-4">Your Threads</h3>

                {/* Visual representation */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {threads.map((thread, idx) => {
                    const size = getThreadSize(thread.entryCount);
                    const sizeClasses = {
                      large: 'w-20 h-20',
                      medium: 'w-14 h-14',
                      small: 'w-10 h-10',
                    };

                    return (
                      <button
                        key={thread.id}
                        onClick={() => handleSelectThread(thread)}
                        className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-glow animate-fade-up`}
                        style={{
                          backgroundColor: thread.color || '#6B8F7A',
                          animationDelay: `${idx * 50}ms`,
                        }}
                        title={`${thread.name}: ${thread.entryCount} entries`}
                      >
                        <span className="text-white font-medium text-xs">
                          {thread.entryCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Thread List */}
                <div className="space-y-2">
                  {threads.map((thread, idx) => (
                    <button
                      key={thread.id}
                      onClick={() => handleSelectThread(thread)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-dark-card/50 transition-all group animate-fade-up"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: thread.color || '#6B8F7A' }}
                      />
                      <div className="flex-1 text-left">
                        <span className="text-text-primary group-hover:text-sage transition-colors">
                          {thread.name}
                        </span>
                        {thread.lastActivity && (
                          <span className="text-xs text-text-secondary ml-2">
                            {formatRelativeDate(thread.lastActivity)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-muted">
                          {thread.entryCount} entries
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-sage transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-8 text-center">
                <GitBranch className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="font-serif text-xl text-text-primary mb-2">No threads yet</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Threads help you organize related journal entries into meaningful narratives.
                </p>
                <button
                  onClick={() => onChangeView(ViewState.EDITOR)}
                  className="px-6 py-3 bg-sage text-white rounded-full hover:shadow-glow transition-all"
                >
                  Create Your First Entry
                </button>
              </div>
            )}

            {/* Insights */}
            {getActiveThreads() >= 2 && (
              <div className="glass-card rounded-2xl p-5 bg-sage/5 border border-sage/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-sage shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">Thread Insight</h4>
                    <p className="text-sm text-text-secondary">
                      Your most active thread is <strong className="text-sage">{threads[0]?.name}</strong> with {threads[0]?.entryCount} entries.
                      {threads[0]?.wordCount > 1000 && ` You've written over ${Math.floor(threads[0].wordCount / 1000)}k words in this thread!`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Detail View
          <div className="space-y-4 animate-fade-up">
            {/* Thread Stats */}
            {selectedThread && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass-card rounded-xl p-3 text-center">
                  <FileText className="w-5 h-5 text-sage mx-auto mb-1" />
                  <span className="text-lg font-serif text-text-primary">{selectedThread.entryCount}</span>
                  <p className="text-xs text-text-secondary">Entries</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <TrendingUp className="w-5 h-5 text-sage mx-auto mb-1" />
                  <span className="text-lg font-serif text-text-primary">{selectedThread.wordCount}</span>
                  <p className="text-xs text-text-secondary">Words</p>
                </div>
                <div className="glass-card rounded-xl p-3 text-center">
                  <Calendar className="w-5 h-5 text-sage mx-auto mb-1" />
                  <span className="text-lg font-serif text-text-primary">
                    {selectedThread.lastActivity ? formatRelativeDate(selectedThread.lastActivity) : '-'}
                  </span>
                  <p className="text-xs text-text-secondary">Last Entry</p>
                </div>
              </div>
            )}

            {/* Entries List */}
            {threadEntries.length > 0 ? (
              <div className="space-y-3">
                {threadEntries.map((entry, idx) => (
                  <button
                    key={entry.id}
                    onClick={() => onChangeView(ViewState.EDITOR, { entryId: entry.id })}
                    className="w-full glass-card rounded-xl p-4 text-left hover:border-sage-border transition-all animate-fade-up"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-serif text-text-primary line-clamp-1">{entry.title}</h4>
                      <span className="text-xs text-text-muted shrink-0">
                        {formatRelativeDate(entry.date)}
                      </span>
                    </div>
                    {entry.content && (
                      <p className="text-sm text-text-secondary line-clamp-2">{entry.content}</p>
                    )}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {entry.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-dark-card rounded text-xs text-text-muted">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center">
                <FileText className="w-10 h-10 text-text-muted mx-auto mb-3" />
                <p className="text-text-secondary">No entries in this thread yet</p>
              </div>
            )}

            {/* Add Entry Button */}
            <button
              onClick={() => onChangeView(ViewState.EDITOR, { threadId: selectedThread?.id })}
              className="w-full py-4 rounded-full bg-sage text-white font-medium hover:shadow-glow transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Entry to Thread
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
