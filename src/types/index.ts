export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface AppState {
  notes: Note[];
  searchQuery: string;
  selectedTag: string | null;
  selectedNoteId: string | null;
  currentView: 'all' | 'archived';
  theme: Theme;
  isCreatingNote: boolean;
  editingNote: Partial<Note> | null;
}

export interface Theme {
  color: 'blue' | 'purple' | 'green' | 'orange';
  font: 'inter' | 'roboto' | 'system';
  mode: 'light' | 'dark';
}

export interface ValidationErrors {
  title?: string;
  content?: string;
}