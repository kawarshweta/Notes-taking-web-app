import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Note, AppState, Theme } from '../types';

const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

const defaultNotes: Note[] = [
  {
    id: '1',
    title: 'React Performance Optimization',
    content: `Key performance optimization techniques:

1. Code Splitting
- Use React.lazy() for route-based splitting
- Implement dynamic imports for heavy components

2. Memoization
- useMemo for expensive calculations
- useCallback for function props
- React.memo for component optimization

3. Virtual List Implementation
- Use react-window for long lists
- Implement infinite scrolling

TODO: Benchmark current application and identify bottlenecks`,
    tags: ['Dev', 'React'],
    createdAt: '2024-10-29T10:00:00Z',
    updatedAt: '2024-10-29T10:00:00Z',
    isArchived: false,
  },
  {
    id: '2',
    title: 'Japan Travel Planning',
    content: `Tokyo - 5 days
- Visit Senso-ji Temple
- Explore Shibuya Crossing
- Day trip to Mount Fuji

Kyoto - 3 days
- Fushimi Inari Shrine
- Bamboo Grove
- Traditional ryokan experience

Budget: $3000
Flight: $800
Accommodation: $1200
Food & Activities: $1000`,
    tags: ['Travel', 'Personal'],
    createdAt: '2024-10-28T09:00:00Z',
    updatedAt: '2024-10-28T09:00:00Z',
    isArchived: false,
  },
  {
    id: '3',
    title: 'Favorite Pasta Recipes',
    content: `Carbonara
- 400g spaghetti
- 200g pancetta
- 4 egg yolks
- 100g Pecorino Romano
- Black pepper

Cacio e Pepe
- 400g tonnarelli
- 200g Pecorino Romano
- Black pepper
- Pasta water

Amatriciana
- 400g bucatini
- 150g guanciale
- 400g San Marzano tomatoes
- Pecorino Romano`,
    tags: ['Cooking', 'Recipes'],
    createdAt: '2024-10-27T08:00:00Z',
    updatedAt: '2024-10-27T08:00:00Z',
    isArchived: false,
  },
  {
    id: '4',
    title: 'Weekly Workout Plan',
    content: `Monday - Chest & Triceps
- Bench Press 4x8-10
- Incline Dumbbell Press 3x10-12
- Tricep Dips 3x12-15
- Close-grip Bench Press 3x10-12

Wednesday - Back & Biceps
- Pull-ups 4x6-8
- Barbell Rows 4x8-10
- Lat Pulldowns 3x10-12
- Bicep Curls 3x12-15

Friday - Legs & Shoulders
- Squats 4x8-10
- Romanian Deadlifts 3x10-12
- Overhead Press 4x8-10
- Lateral Raises 3x12-15`,
    tags: ['Dev', 'React'],
    createdAt: '2024-10-25T07:00:00Z',
    updatedAt: '2024-10-25T07:00:00Z',
    isArchived: false,
  },
  {
    id: '5',
    title: 'Meal Prep Ideas',
    content: `Sunday Prep:
- Grilled chicken breast (5 portions)
- Brown rice (2 cups cooked)
- Roasted vegetables (broccoli, bell peppers, carrots)
- Overnight oats for breakfast

Snack Options:
- Greek yogurt with berries
- Mixed nuts
- Apple with almond butter
- Protein smoothie

Shopping List:
- Chicken breast (2 lbs)
- Brown rice
- Fresh vegetables
- Greek yogurt
- Oats and fruits`,
    tags: ['Cooking', 'Health', 'Recipes'],
    createdAt: '2024-10-12T06:00:00Z',
    updatedAt: '2024-10-12T06:00:00Z',
    isArchived: false,
  },
  {
    id: '6',
    title: 'Reading List',
    content: `Currently Reading:
- "Clean Code" by Robert Martin
- "The Psychology of Money" by Morgan Housel

Next Up:
- "Atomic Habits" by James Clear
- "Designing Data-Intensive Applications" by Martin Kleppmann
- "The Pragmatic Programmer" by Andy Hunt

Fiction:
- "Project Hail Mary" by Andy Weir
- "Klara and the Sun" by Kazuo Ishiguro`,
    tags: ['Personal', 'Dev'],
    createdAt: '2024-10-05T05:00:00Z',
    updatedAt: '2024-10-05T05:00:00Z',
    isArchived: false,
  },
  {
    id: '7',
    title: 'Fitness Goals 2025',
    content: `Strength Goals:
- Bench Press: 1.5x bodyweight
- Squat: 2x bodyweight
- Deadlift: 2.5x bodyweight
- Pull-ups: 15 consecutive

Endurance Goals:
- Run 5K under 25 minutes
- Complete a half marathon
- Swim 1km without stopping

Health Metrics:
- Body fat percentage: 12-15%
- Sleep: 7-8 hours nightly
- Water intake: 3L daily

Monthly Progress Reviews:
- Track workouts and PRs
- Body composition analysis
- Adjust nutrition plan`,
    tags: ['Fitness', 'Health', 'Personal'],
    createdAt: '2024-09-22T04:00:00Z',
    updatedAt: '2024-09-22T04:00:00Z',
    isArchived: false,
  },
  ];

const initialState: AppState = {
  notes: defaultNotes,
  searchQuery: '',
  selectedTag: null,
  selectedNoteId: defaultNotes[0]?.id || null,
  currentView: 'all',
  theme: {
    color: 'blue',
    font: 'inter',
    mode: 'light',
  },
  isCreatingNote: false,
  editingNote: null,
  sortBy: 'updated',
  autoSave: true,
  compactView: false,
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote: (state, action: PayloadAction<{ title: string; content: string; tags: string[] }>) => {
      const newNote: Note = {
        id: generateId(),
        title: action.payload.title,
        content: action.payload.content,
        tags: action.payload.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
      };
      state.notes.unshift(newNote);
      state.selectedNoteId = newNote.id;
      state.isCreatingNote = false;
      state.editingNote = null;
    },
    updateNote: (state, action: PayloadAction<{ id: string; updates: Partial<Note> }>) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          ...action.payload.updates,
          updatedAt: new Date().toISOString(),
        };
      }
      state.editingNote = null;
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
      if (state.selectedNoteId === action.payload) {
        state.selectedNoteId = state.notes[0]?.id || null;
      }
    },
    archiveNote: (state, action: PayloadAction<string>) => {
      const index = state.notes.findIndex(note => note.id === action.payload);
      if (index !== -1) {
        state.notes[index].isArchived = true;
        state.notes[index].updatedAt = new Date().toISOString();
      }
    },
    unarchiveNote: (state, action: PayloadAction<string>) => {
      const index = state.notes.findIndex(note => note.id === action.payload);
      if (index !== -1) {
        state.notes[index].isArchived = false;
        state.notes[index].updatedAt = new Date().toISOString();
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
    setSelectedNoteId: (state, action: PayloadAction<string | null>) => {
      state.selectedNoteId = action.payload;
      state.isCreatingNote = false;
      state.editingNote = null;
    },
    setCurrentView: (state, action: PayloadAction<'all' | 'archived'>) => {
      state.currentView = action.payload;
      state.selectedTag = null;
      // Select first note in the new view
      const filteredNotes = state.notes.filter(note => 
        action.payload === 'archived' ? note.isArchived : !note.isArchived
      );
      state.selectedNoteId = filteredNotes[0]?.id || null;
    },
    setTheme: (state, action: PayloadAction<Partial<Theme>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    startCreatingNote: (state) => {
      state.isCreatingNote = true;
      state.selectedNoteId = null;
      state.editingNote = {
        id: generateId(),
        title: '',
        content: '',
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isArchived: false,
      };
    },
    setEditingNote: (state, action: PayloadAction<Partial<Note> | null>) => {
      state.editingNote = action.payload;
    },
    cancelEditing: (state) => {
      state.isCreatingNote = false;
      state.editingNote = null;
      if (!state.selectedNoteId && state.notes.length > 0) {
        state.selectedNoteId = state.notes[0].id;
      }
    },
    setSortBy: (state, action: PayloadAction<'updated' | 'created' | 'alphabetical' | 'tags'>) => {
      state.sortBy = action.payload;
    },
    setAutoSave: (state, action: PayloadAction<boolean>) => {
      state.autoSave = action.payload;
    },
    setCompactView: (state, action: PayloadAction<boolean>) => {
      state.compactView = action.payload;
    },
    importNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      state.selectedNoteId = action.payload[0]?.id || null;
    },
    clearAllData: (state) => {
      state.notes = [];
      state.selectedNoteId = null;
      state.searchQuery = '';
      state.selectedTag = null;
      state.isCreatingNote = false;
      state.editingNote = null;
    },
  },
});

export const {
  createNote,
  updateNote,
  deleteNote,
  archiveNote,
  unarchiveNote,
  setSearchQuery,
  setSelectedTag,
  setSelectedNoteId,
  setCurrentView,
  setTheme,
  startCreatingNote,
  setEditingNote,
  cancelEditing,
  setSortBy,
  setAutoSave,
  setCompactView,
  importNotes,
  clearAllData,
} = notesSlice.actions;

export default notesSlice.reducer;