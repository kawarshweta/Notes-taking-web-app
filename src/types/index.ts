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
  sortBy: 'updated' | 'created' | 'alphabetical' | 'tags';
  autoSave: boolean;
  compactView: boolean;
}

export interface Theme {
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo' | 'teal' | 'red' | 'yellow' | 'cyan';
  font: 'inter' | 'roboto' | 'system' | 'open-sans' | 'source-sans' | 'poppins' | 'lato' | 'montserrat';
  mode: 'light' | 'dark';
}

export interface ValidationErrors {
  title?: string;
  content?: string;
}