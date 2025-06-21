import { Note } from '../types';

export const sortNotes = (notes: Note[], sortBy: 'updated' | 'created' | 'alphabetical' | 'tags'): Note[] => {
  const sortedNotes = [...notes];

  switch (sortBy) {
    case 'updated':
      return sortedNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    
    case 'created':
      return sortedNotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    case 'alphabetical':
      return sortedNotes.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
    
    case 'tags':
      return sortedNotes.sort((a, b) => {
        const aFirstTag = a.tags[0]?.toLowerCase() || 'z'; // Notes without tags go to end
        const bFirstTag = b.tags[0]?.toLowerCase() || 'z';
        if (aFirstTag === bFirstTag) {
          // If same first tag, sort by title
          return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
        }
        return aFirstTag.localeCompare(bFirstTag);
      });
    
    default:
      return sortedNotes;
  }
}; 