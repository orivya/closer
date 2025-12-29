# ORIVYA V1 — React Component Reference

This guide shows how to convert the HTML prototypes into production React components.

---

## 1. Project Structure

```
src/
├── app/                      # Next.js app directory (or pages/)
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (main)/
│   │   ├── page.tsx          # Home dashboard
│   │   ├── notes/
│   │   │   ├── page.tsx      # Notes list
│   │   │   ├── [id]/page.tsx # Note view
│   │   │   └── new/page.tsx  # Note editor
│   │   ├── threads/
│   │   ├── goals/
│   │   ├── insights/
│   │   └── settings/
│   └── layout.tsx
├── components/
│   ├── ui/                   # Atomic components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Sheet.tsx
│   │   ├── Toast.tsx
│   │   ├── Toggle.tsx
│   │   └── ...
│   ├── features/             # Feature-specific components
│   │   ├── notes/
│   │   │   ├── NoteCard.tsx
│   │   │   ├── NoteEditor.tsx
│   │   │   └── NoteView.tsx
│   │   ├── threads/
│   │   ├── goals/
│   │   └── insights/
│   └── layout/              # Layout components
│       ├── Header.tsx
│       ├── TabBar.tsx
│       ├── Sidebar.tsx
│       └── PageContainer.tsx
├── hooks/                   # Custom hooks
│   ├── useNotes.ts
│   ├── useAutosave.ts
│   ├── useOffline.ts
│   └── useKeyboardShortcuts.ts
├── stores/                  # State management
│   ├── notes.ts
│   ├── editor.ts
│   └── ui.ts
├── lib/                     # Utilities
│   ├── api.ts
│   ├── db.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

---

## 2. Core UI Components

### 2.1 Button

```tsx
// components/ui/Button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading,
    leftIcon,
    rightIcon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2',
          'font-medium rounded-md transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Size variants
          {
            'h-8 px-3 text-xs': size === 'sm',
            'h-11 px-5 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          // Color variants
          {
            'bg-sage text-white hover:bg-sage-dark active:scale-[0.98]': variant === 'primary',
            'bg-bg-surface-2 text-text-secondary hover:bg-bg-hover hover:text-text-primary': variant === 'secondary',
            'bg-transparent text-text-tertiary hover:text-text-secondary': variant === 'ghost',
            'bg-error text-white hover:bg-red-600': variant === 'danger',
          },
          
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : leftIcon}
        
        {children}
        
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 2.2 Card

```tsx
// components/ui/Card.tsx
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'gradient' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ 
  className, 
  variant = 'default', 
  padding = 'md',
  children, 
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border',
        
        // Variants
        {
          'bg-bg-surface border-border-subtle': variant === 'default',
          'bg-bg-elevated border-border shadow-lg': variant === 'elevated',
          'bg-gradient-card border-sage-muted': variant === 'gradient',
          'bg-bg-surface border-border-subtle hover:border-border cursor-pointer transition-all hover:shadow-md': variant === 'interactive',
        },
        
        // Padding
        {
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-6': padding === 'lg',
        },
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### 2.3 Input

```tsx
// components/ui/Input.tsx
import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
            className={cn(
              'w-full h-11 px-4 text-base text-text-primary',
              'bg-bg-surface-2 border rounded-md',
              'placeholder:text-text-muted',
              'transition-all duration-150',
              'focus:outline-none focus:ring-0',
              
              // States
              error 
                ? 'border-error bg-error-subtle focus:border-error' 
                : 'border-border-subtle focus:border-sage focus:bg-bg-hover',
              
              // Icons
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || hint) && (
          <p className={cn(
            'text-xs flex items-center gap-1.5',
            error ? 'text-error' : 'text-text-muted'
          )}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 2.4 Modal / Sheet

```tsx
// components/ui/Modal.tsx
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  size = 'md' 
}: ModalProps) {
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-modal">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        {/* Panel Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className={cn(
            'flex min-h-full items-end sm:items-center justify-center',
            isMobile ? 'p-0' : 'p-4'
          )}>
            <Transition.Child
              as={Fragment}
              enter={isMobile ? 'ease-out duration-300' : 'ease-out duration-200'}
              enterFrom={isMobile ? 'translate-y-full' : 'opacity-0 scale-95'}
              enterTo={isMobile ? 'translate-y-0' : 'opacity-100 scale-100'}
              leave={isMobile ? 'ease-in duration-200' : 'ease-in duration-150'}
              leaveFrom={isMobile ? 'translate-y-0' : 'opacity-100 scale-100'}
              leaveTo={isMobile ? 'translate-y-full' : 'opacity-0 scale-95'}
            >
              <Dialog.Panel
                className={cn(
                  'relative w-full bg-bg-elevated border-border',
                  'transform transition-all',
                  
                  // Mobile: Bottom sheet
                  isMobile && [
                    'rounded-t-2xl border-t',
                    'max-h-[90vh] overflow-y-auto',
                  ],
                  
                  // Desktop: Centered modal
                  !isMobile && [
                    'rounded-xl border',
                    'max-h-[85vh] overflow-y-auto',
                    {
                      'max-w-sm': size === 'sm',
                      'max-w-md': size === 'md',
                      'max-w-lg': size === 'lg',
                      'max-w-4xl': size === 'full',
                    },
                  ],
                )}
              >
                {/* Drag handle (mobile) */}
                {isMobile && (
                  <div className="sticky top-0 flex justify-center py-3 bg-bg-elevated">
                    <div className="w-10 h-1 bg-bg-hover rounded-full" />
                  </div>
                )}
                
                {/* Header */}
                {(title || description) && (
                  <div className="px-6 pb-4 pt-2 sm:pt-6 border-b border-border-subtle">
                    {title && (
                      <Dialog.Title className="text-lg font-display font-medium text-text-primary">
                        {title}
                      </Dialog.Title>
                    )}
                    {description && (
                      <Dialog.Description className="mt-1 text-sm text-text-tertiary">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                )}
                
                {/* Content */}
                <div className="p-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
```

### 2.5 Toast

```tsx
// components/ui/Toast.tsx
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  onDismiss: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const colors = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-info',
  warning: 'text-warning',
};

export function Toast({ id, type, message, action, duration = 4000, onDismiss }: ToastProps) {
  const Icon = icons[type];
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);
  
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-4 py-3',
        'bg-bg-elevated border border-border rounded-lg',
        'shadow-xl animate-slide-up'
      )}
      role="alert"
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0', colors[type])} />
      
      <p className="flex-1 text-sm text-text-secondary">{message}</p>
      
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm font-medium text-sage hover:text-sage-light"
        >
          {action.label}
        </button>
      )}
      
      <button
        onClick={() => onDismiss(id)}
        className="p-1 text-text-muted hover:text-text-secondary rounded"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast Container
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-toast space-y-2 sm:w-96">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
```

---

## 3. Feature Components

### 3.1 Note Card

```tsx
// components/features/notes/NoteCard.tsx
import { formatDistanceToNow } from 'date-fns';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { Note } from '@/types';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  showThread?: boolean;
}

export function NoteCard({ note, onClick, showThread = true }: NoteCardProps) {
  const title = note.title || note.body.slice(0, 50) + '...';
  const preview = note.bodyPlain.slice(0, 150);
  
  return (
    <Card 
      variant="interactive" 
      padding="md"
      onClick={onClick}
      className="group"
    >
      <div className="flex gap-3">
        {/* Category indicator */}
        <div className={cn(
          'w-1 rounded-full flex-shrink-0',
          {
            'bg-sage': note.category === 'personal',
            'bg-blue-500': note.category === 'work',
            'bg-rose-500': note.category === 'relationships',
            'bg-amber-500': note.category === 'health',
            'bg-text-muted': note.category === 'uncategorized',
          }
        )} />
        
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-sage transition-colors">
            {title}
          </h3>
          
          {/* Preview */}
          <p className="mt-1 text-sm text-text-tertiary line-clamp-2">
            {preview}
          </p>
          
          {/* Meta */}
          <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
            <span>{formatDistanceToNow(note.createdAt, { addSuffix: true })}</span>
            
            {showThread && note.threadId && (
              <span className="flex items-center gap-1 text-sage">
                <ThreadIcon className="w-3 h-3" />
                {note.threadTitle}
              </span>
            )}
            
            <span>{note.wordCount} words</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### 3.2 Note Editor

```tsx
// components/features/notes/NoteEditor.tsx
import { useRef, useEffect, useCallback } from 'react';
import { useAutosave } from '@/hooks/useAutosave';
import { useEditorStore } from '@/stores/editor';
import { AutosaveIndicator } from './AutosaveIndicator';
import { CategoryPicker } from './CategoryPicker';
import { cn } from '@/lib/utils';

export function NoteEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    draftBody,
    draftCategory,
    isFocusMode,
    saveStatus,
    setDraft,
    saveDraft,
  } = useEditorStore();
  
  // Autosave hook
  useAutosave(draftBody, saveDraft, { delay: 2000 });
  
  // Auto-resize textarea
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    
    // Auto-resize
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [setDraft]);
  
  // Word count
  const wordCount = draftBody.trim().split(/\s+/).filter(Boolean).length;
  
  return (
    <div className={cn(
      'min-h-screen bg-bg-base',
      isFocusMode && 'pt-safe-top'
    )}>
      {/* Header */}
      {!isFocusMode && (
        <header className="sticky top-0 z-header px-4 py-3 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <button className="p-2 -ml-2 text-text-secondary hover:text-text-primary">
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <AutosaveIndicator status={saveStatus} />
            
            <button className="text-sm font-medium text-sage hover:text-sage-light">
              Done
            </button>
          </div>
        </header>
      )}
      
      {/* Editor */}
      <div className={cn(
        'px-5 py-6',
        isFocusMode && 'max-w-2xl mx-auto'
      )}>
        <textarea
          ref={textareaRef}
          value={draftBody}
          onChange={handleInput}
          placeholder="What's on your mind?"
          className={cn(
            'w-full min-h-[60vh] resize-none',
            'bg-transparent text-text-primary',
            'text-lg leading-relaxed',
            'placeholder:text-text-muted',
            'focus:outline-none',
            'font-body'
          )}
          autoFocus
        />
      </div>
      
      {/* Footer toolbar */}
      {!isFocusMode && (
        <footer className="fixed bottom-0 inset-x-0 px-4 py-3 bg-bg-surface border-t border-border-subtle pb-safe-bottom">
          <div className="flex items-center justify-between">
            <CategoryPicker 
              value={draftCategory} 
              onChange={(cat) => useEditorStore.setState({ draftCategory: cat })} 
            />
            
            <span className="text-xs text-text-muted">
              {wordCount} words
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
```

### 3.3 Autosave Indicator

```tsx
// components/features/notes/AutosaveIndicator.tsx
import { cn } from '@/lib/utils';
import { Cloud, CloudOff, Check, Loader } from 'lucide-react';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface AutosaveIndicatorProps {
  status: SaveStatus;
}

export function AutosaveIndicator({ status }: AutosaveIndicatorProps) {
  return (
    <div className={cn(
      'flex items-center gap-1.5 text-xs',
      {
        'text-text-muted': status === 'idle',
        'text-sage': status === 'saving' || status === 'saved',
        'text-error': status === 'error',
      }
    )}>
      {status === 'idle' && (
        <>
          <Cloud className="w-4 h-4" />
          <span>Draft</span>
        </>
      )}
      
      {status === 'saving' && (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </>
      )}
      
      {status === 'saved' && (
        <>
          <Check className="w-4 h-4" />
          <span>Saved</span>
        </>
      )}
      
      {status === 'error' && (
        <>
          <CloudOff className="w-4 h-4" />
          <span>Couldn't save</span>
        </>
      )}
    </div>
  );
}
```

---

## 4. Custom Hooks

### 4.1 useAutosave

```tsx
// hooks/useAutosave.ts
import { useEffect, useRef, useCallback } from 'react';

interface UseAutosaveOptions {
  delay?: number;
  enabled?: boolean;
}

export function useAutosave(
  value: string,
  onSave: () => Promise<void>,
  { delay = 2000, enabled = true }: UseAutosaveOptions = {}
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastValueRef = useRef(value);
  
  const debouncedSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(async () => {
      if (value !== lastValueRef.current && enabled) {
        await onSave();
        lastValueRef.current = value;
      }
    }, delay);
  }, [value, onSave, delay, enabled]);
  
  useEffect(() => {
    if (value !== lastValueRef.current) {
      debouncedSave();
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debouncedSave]);
  
  // Save immediately on unmount if there are changes
  useEffect(() => {
    return () => {
      if (value !== lastValueRef.current && enabled) {
        onSave();
      }
    };
  }, []);
}
```

### 4.2 useOffline

```tsx
// hooks/useOffline.ts
import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return { isOnline, isOffline: !isOnline };
}
```

### 4.3 useKeyboardShortcuts

```tsx
// hooks/useKeyboardShortcuts.ts
import { useEffect, useCallback } from 'react';

type KeyboardShortcut = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  meta?: boolean;
  action: () => void;
};

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const metaMatch = shortcut.meta ? event.metaKey : true;
      
      if (keyMatch && ctrlMatch && shiftMatch && metaMatch) {
        event.preventDefault();
        shortcut.action();
        return;
      }
    }
  }, [shortcuts]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Usage example:
// useKeyboardShortcuts([
//   { key: 'n', action: () => router.push('/notes/new') },
//   { key: 'k', ctrl: true, action: () => openSearch() },
//   { key: 's', ctrl: true, action: () => saveNote() },
// ]);
```

---

## 5. State Management (Zustand)

```tsx
// stores/notes.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, NoteCategory } from '@/types';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  filter: {
    category: NoteCategory | 'all';
    status: 'active' | 'archived' | 'all';
    threadId: string | null;
  };
  
  // Actions
  fetchNotes: () => Promise<void>;
  createNote: (data: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, data: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setFilter: (filter: Partial<NotesState['filter']>) => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      isLoading: false,
      filter: {
        category: 'all',
        status: 'active',
        threadId: null,
      },
      
      fetchNotes: async () => {
        set({ isLoading: true });
        try {
          const response = await api.getNotes(get().filter);
          set({ notes: response.data, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      createNote: async (data) => {
        // Optimistic update
        const tempNote = { id: `temp_${Date.now()}`, ...data, syncStatus: 'pending' };
        set((state) => ({ notes: [tempNote, ...state.notes] }));
        
        try {
          const note = await api.createNote(data);
          set((state) => ({
            notes: state.notes.map((n) => n.id === tempNote.id ? note : n),
          }));
          return note;
        } catch (error) {
          // Revert on error
          set((state) => ({
            notes: state.notes.filter((n) => n.id !== tempNote.id),
          }));
          throw error;
        }
      },
      
      updateNote: async (id, data) => {
        const original = get().notes.find((n) => n.id === id);
        
        // Optimistic update
        set((state) => ({
          notes: state.notes.map((n) => n.id === id ? { ...n, ...data } : n),
        }));
        
        try {
          await api.updateNote(id, data);
        } catch (error) {
          // Revert
          if (original) {
            set((state) => ({
              notes: state.notes.map((n) => n.id === id ? original : n),
            }));
          }
          throw error;
        }
      },
      
      deleteNote: async (id) => {
        const original = get().notes.find((n) => n.id === id);
        
        // Optimistic remove
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
        
        try {
          await api.deleteNote(id);
        } catch (error) {
          // Revert
          if (original) {
            set((state) => ({ notes: [...state.notes, original] }));
          }
          throw error;
        }
      },
      
      setFilter: (filter) => {
        set((state) => ({ filter: { ...state.filter, ...filter } }));
        get().fetchNotes();
      },
    }),
    {
      name: 'orivya-notes',
      partialize: (state) => ({ notes: state.notes }),
    }
  )
);
```

---

## 6. Utils

```tsx
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format word count
export function formatWordCount(count: number): string {
  if (count === 1) return '1 word';
  return `${count.toLocaleString()} words`;
}

// Generate greeting based on time
export function getGreeting(): { greeting: string; subline: string } {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return {
      greeting: 'Good morning',
      subline: 'How are you starting your day?',
    };
  }
  if (hour < 17) {
    return {
      greeting: 'Good afternoon',
      subline: 'Taking a moment to reflect?',
    };
  }
  if (hour < 21) {
    return {
      greeting: 'Good evening',
      subline: 'How was your day?',
    };
  }
  return {
    greeting: 'Good night',
    subline: 'Winding down with some thoughts?',
  };
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
```

---

*Last updated: December 2025*
