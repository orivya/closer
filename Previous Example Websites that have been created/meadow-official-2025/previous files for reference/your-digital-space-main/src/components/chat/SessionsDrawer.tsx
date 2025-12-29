import { useState, useMemo, useRef, useEffect } from "react";
import { Plus, Search, MessageSquare, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Session } from "@/hooks/useSessions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SessionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNewSession: () => void;
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  sessions: Session[];
  isLoading: boolean;
  onRenameSession: (id: string, newTitle: string) => Promise<boolean>;
  onDeleteSession: (id: string) => Promise<boolean>;
}

interface SessionCardProps {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
  onRename: (newTitle: string) => Promise<boolean>;
  onDelete: () => Promise<boolean>;
  onDeletedActive: () => void;
}

function SessionCard({ 
  session, 
  isActive, 
  onSelect, 
  onRename, 
  onDelete,
  onDeletedActive,
}: SessionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(session.title || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditValue(session.title || "");
    setIsEditing(true);
  };

  const handleSaveRename = async () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== session.title) {
      await onRename(trimmed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveRename();
    } else if (e.key === "Escape") {
      setEditValue(session.title || "");
      setIsEditing(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete();
    setIsDeleting(false);
    setShowDeleteDialog(false);
    if (success && isActive) {
      onDeletedActive();
    }
  };

  return (
    <>
      <div
        onClick={() => !isEditing && onSelect()}
        className={cn(
          "group flex items-start gap-2 px-3 py-3 rounded-md cursor-pointer transition-all duration-200 mb-0.5",
          isActive ? "bg-sage-subtle" : "hover:bg-elevated"
        )}
      >
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="w-full py-0.5 px-1.5 -ml-1.5 bg-elevated border border-sage rounded text-[13px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-sage-subtle"
            />
          ) : (
            <div className="text-[13px] font-medium text-foreground truncate">
              {session.title}
            </div>
          )}
          {session.preview && !isEditing && (
            <div className="text-[11px] text-text-muted truncate mt-1">
              {session.preview}
            </div>
          )}
          {!isEditing && (
            <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
              <span>{session.formattedDate}</span>
              {session.insightCount > 0 && (
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-sage rounded-full" />
                  <span className="text-sage">{session.insightCount} insight{session.insightCount !== 1 ? "s" : ""}</span>
                </span>
              )}
            </div>
          )}
        </div>

        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded hover:bg-subtle transition-opacity duration-150"
                aria-label="Session options"
              >
                <MoreVertical className="w-4 h-4 text-text-muted" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-40 bg-elevated border border-subtle z-[100]"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem
                onClick={handleStartRename}
                className="flex items-center gap-2 text-[13px] cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                className="flex items-center gap-2 text-[13px] text-red-400 focus:text-red-400 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-elevated border border-subtle">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Delete this conversation?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-text-muted">
              This cannot be undone. Any saved insights from this conversation will remain in your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-subtle text-foreground hover:bg-elevated">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function SessionsDrawer({
  isOpen,
  onClose,
  onNewSession,
  currentSessionId,
  onSelectSession,
  sessions,
  isLoading,
  onRenameSession,
  onDeleteSession,
}: SessionsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = useMemo(() => {
    if (!searchQuery.trim()) return sessions;
    const query = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title?.toLowerCase().includes(query) ||
        s.preview.toLowerCase().includes(query)
    );
  }, [sessions, searchQuery]);

  const groupedSessions = useMemo(() => {
    const groups: Record<string, Session[]> = {};
    const groupOrder = ["Today", "Yesterday", "This Week", "This Month", "Older"];

    filteredSessions.forEach((session) => {
      if (!groups[session.group]) {
        groups[session.group] = [];
      }
      groups[session.group].push(session);
    });

    const sorted: Record<string, Session[]> = {};
    groupOrder.forEach((group) => {
      if (groups[group]) {
        sorted[group] = groups[group];
      }
    });
    return sorted;
  }, [filteredSessions]);

  const hasNoSessions = sessions.length === 0 && !isLoading;
  const hasNoResults = filteredSessions.length === 0 && searchQuery.trim() && !isLoading;

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 w-[280px] bg-background border-r border-subtle z-50 flex flex-col transition-transform duration-300",
          // Mobile: edge-to-edge, Tablet+: offset for sidebar
          "left-0 xs:left-[72px]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-subtle">
          <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted mb-4">
            Sessions
          </div>
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-transparent border border-sage rounded-md text-[13px] font-medium text-sage hover:bg-sage-subtle transition-all duration-150 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" strokeWidth={2} />
            New Session
          </button>
        </div>

        <div className="px-5 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-text-muted" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-9 pr-3 bg-elevated border border-subtle rounded-md text-[13px] text-foreground placeholder:text-text-muted focus:border-sage focus:ring-[3px] focus:ring-sage-subtle transition-all duration-150"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          {isLoading && (
            <div className="flex items-center justify-center py-12 text-text-muted text-[13px]">
              Loading sessions...
            </div>
          )}

          {hasNoSessions && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="w-10 h-10 text-text-muted mb-3 opacity-50" />
              <p className="text-[13px] text-text-muted">
                Your conversations will appear here
              </p>
            </div>
          )}

          {hasNoResults && (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <p className="text-[13px] text-text-muted">
                No sessions match "{searchQuery}"
              </p>
            </div>
          )}

          {!isLoading &&
            Object.entries(groupedSessions).map(([group, groupSessions]) => (
              <div key={group} className="mb-5">
                <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-text-muted px-3 py-2 mb-1">
                  {group}
                </div>
                {groupSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    isActive={currentSessionId === session.id}
                    onSelect={() => {
                      onSelectSession(session.id);
                      onClose();
                    }}
                    onRename={(newTitle) => onRenameSession(session.id, newTitle)}
                    onDelete={() => onDeleteSession(session.id)}
                    onDeletedActive={onNewSession}
                  />
                ))}
              </div>
            ))}
        </div>
      </aside>
    </>
  );
}
