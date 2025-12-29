/**
 * SessionHistory Component
 * Displays Essence conversation history with session management
 */

import React, { useState } from 'react';
import {
  Clock,
  MessageCircle,
  ChevronRight,
  Calendar,
  Trash2,
  MoreHorizontal,
  Lightbulb,
  X,
  Search,
} from 'lucide-react';
import { DepthLevel, DEPTH_LEVELS, SessionListItem } from '../../types/essence';

interface SessionHistoryProps {
  sessions: SessionListItem[];
  onSelectSession: (sessionId: string) => void;
  onDeleteSession?: (sessionId: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessions,
  onSelectSession,
  onDeleteSession,
  onClose,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);

  const getDepthColor = (depth: DepthLevel) => {
    const colors = {
      vent: 'bg-stone-100 text-stone-500',
      reflect: 'bg-sage-100 text-sage-600',
      explore: 'bg-amber-100 text-amber-600',
      deep: 'bg-purple-100 text-purple-600',
    };
    return colors[depth];
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatDuration = (start: Date, end?: Date) => {
    if (!end) return 'In progress';
    const diff = end.getTime() - start.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  // Group sessions by date
  const groupedSessions = sessions.reduce((groups, session) => {
    const date = session.startedAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {} as Record<string, SessionListItem[]>);

  // Filter by search query
  const filterSessions = (sessions: SessionListItem[]) => {
    if (!searchQuery) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.summary?.toLowerCase().includes(query) ||
        s.primaryTheme?.toLowerCase().includes(query)
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Clock size={18} className="text-sage-600" />
            </div>
            <div>
              <h2 className="font-medium text-stone-800">Session History</h2>
              <p className="text-xs text-stone-400">{sessions.length} conversations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-stone-100">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-sage-300 focus:ring-2 focus:ring-sage-100"
            />
          </div>
        </div>

        {/* Sessions list */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-stone-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={32} className="mx-auto mb-3 text-stone-300" />
              <p className="text-stone-500">No conversations yet</p>
              <p className="text-xs text-stone-400 mt-1">
                Start a new session to begin
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => {
                const filtered = filterSessions(dateSessions);
                if (filtered.length === 0) return null;

                return (
                  <div key={date}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <Calendar size={12} className="text-stone-400" />
                      <span className="text-xs font-medium text-stone-400">{date}</span>
                    </div>
                    <div className="space-y-2">
                      {filtered.map((session) => (
                        <div
                          key={session.id}
                          className="group relative bg-white border border-stone-100 rounded-xl p-4 hover:border-sage-200 hover:shadow-sm transition-all"
                        >
                          <div
                            onClick={() => onSelectSession(session.id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getDepthColor(
                                    session.depthLevel
                                  )}`}
                                >
                                  {DEPTH_LEVELS[session.depthLevel].name}
                                </span>
                                <span className="text-xs text-stone-400">
                                  {formatDate(session.startedAt)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenuFor(
                                      showMenuFor === session.id ? null : session.id
                                    );
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                                >
                                  <MoreHorizontal size={14} />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm text-stone-700 line-clamp-2 mb-2">
                              {session.summary || 'Untitled conversation'}
                            </p>

                            <div className="flex items-center gap-3 text-[10px] text-stone-400">
                              <span className="flex items-center gap-1">
                                <MessageCircle size={10} />
                                {session.messageCount} messages
                              </span>
                              <span>
                                {formatDuration(session.startedAt, session.endedAt)}
                              </span>
                              {session.primaryTheme && (
                                <span className="flex items-center gap-1">
                                  <Lightbulb size={10} />
                                  {session.primaryTheme}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Dropdown menu */}
                          {showMenuFor === session.id && onDeleteSession && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenuFor(null)}
                              />
                              <div className="absolute right-2 top-10 z-20 bg-white rounded-lg shadow-lg border border-stone-200 py-1 min-w-[120px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSession(session.id);
                                    setShowMenuFor(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
