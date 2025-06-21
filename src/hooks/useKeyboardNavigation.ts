import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSelectedNoteId, startCreatingNote } from '../store/notesSlice';

export const useKeyboardNavigation = () => {
  const dispatch = useDispatch();
  const { notes, selectedNoteId, currentView, selectedTag, searchQuery } = useSelector(
    (state: RootState) => state.notes
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const filteredNotes = notes
        .filter(note => (currentView === 'archived' ? note.isArchived : !note.isArchived))
        .filter(note => !selectedTag || note.tags.includes(selectedTag))
        .filter(note => {
          if (!searchQuery.trim()) return true;
          const query = searchQuery.toLowerCase();
          return (
            note.title.toLowerCase().includes(query) ||
            note.content.toLowerCase().includes(query) ||
            note.tags.some(tag => tag.toLowerCase().includes(query))
          );
        });

      const currentIndex = selectedNoteId 
        ? filteredNotes.findIndex(note => note.id === selectedNoteId)
        : -1;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            dispatch(setSelectedNoteId(filteredNotes[currentIndex - 1].id));
          }
          break;

        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < filteredNotes.length - 1) {
            dispatch(setSelectedNoteId(filteredNotes[currentIndex + 1].id));
          }
          break;

        case 'n':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            dispatch(startCreatingNote());
          }
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, notes, selectedNoteId, currentView, selectedTag, searchQuery]);
};