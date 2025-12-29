export type ViewState = 'landing' | 'home' | 'journal' | 'explore' | 'settings' | 'editor';

export interface Entry {
  id: string;
  title: string;
  content: string;
  preview: string;
  thread?: string;
  date: string;
  timestamp: number;
  wordCount: number;
  mood?: string;
}

export interface Thread {
  name: string;
  count: number;
  latestPreview: string;
}

export type Mood = 'Low' | 'Cloudy' | 'Steady' | 'Content' | 'Radiant';

export interface AppState {
  currentView: ViewState;
  entries: Entry[];
  moodLogged: Mood | null;
  moodDismissed: boolean;
  activeEntryId: string | null; // For the editor
  editorPrompt?: string; // If starting from a prompt
}
