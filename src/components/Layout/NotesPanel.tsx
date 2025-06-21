import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedNoteId, setSearchQuery, startCreatingNote } from '../../store/notesSlice';
import { Search, Plus } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { getThemeClasses } from '../../utils/theme';
import NoteCard from '../NoteCard/NoteCard';
import { Note } from '../../types';

const NotesPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    notes, 
    searchQuery, 
    selectedTag, 
    selectedNoteId, 
    currentView, 
    theme,
    isCreatingNote 
  } = useSelector((state: RootState) => state.notes);
  
  const themeClasses = getThemeClasses(theme);

  const filteredNotes = useMemo(() => {
    console.log('NotesPanel - Filtering with:', { selectedTag, currentView, searchQuery });
    
    let filtered = notes.filter((note: Note) => 
      currentView === 'archived' ? note.isArchived : !note.isArchived
    );

    console.log('NotesPanel - After view filter:', filtered.length);

    if (selectedTag) {
      console.log('NotesPanel - Filtering by tag:', selectedTag);
      filtered = filtered.filter((note: Note) => note.tags.includes(selectedTag));
      console.log('NotesPanel - After tag filter:', filtered.length);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((note: Note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a: Note, b: Note) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, currentView, selectedTag, searchQuery]);

  const handleNoteSelect = (noteId: string) => {
    dispatch(setSelectedNoteId(noteId));
  };

  const handleCreateNote = () => {
    dispatch(startCreatingNote());
  };

  const getViewTitle = () => {
    if (selectedTag) return `#${selectedTag}`;
    return currentView === 'archived' ? 'Archived Notes' : 'All Notes';
  };

  const getNotesCount = () => {
    return filteredNotes.length;
  };

  return (
    <div className={`w-80 ${themeClasses.surface} border-r ${themeClasses.border} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{getViewTitle()}</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({getNotesCount()})
            </span>
          </div>
          {currentView !== 'archived' && (
            <button
              onClick={handleCreateNote}
              className={`flex items-center gap-2 px-3 py-1.5 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className={`w-full pl-9 pr-3 py-2 border ${themeClasses.border} rounded-lg ${themeClasses.input} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-2">
              {searchQuery ? 'No notes match your search' : 
               selectedTag ? `No notes with tag "${selectedTag}"` :
               currentView === 'archived' ? 'No archived notes' : 'No notes yet'}
            </div>
            {!searchQuery && !selectedTag && currentView !== 'archived' && (
              <button
                onClick={handleCreateNote}
                className={`text-sm ${themeClasses.primary} hover:underline`}
              >
                Create your first note
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredNotes.map((note: Note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId && !isCreatingNote}
                onClick={() => handleNoteSelect(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPanel;