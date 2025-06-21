import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentView, setSelectedTag } from '../../store/notesSlice';
import { PenTool, FileText, Archive, Tag } from 'lucide-react';
import { getThemeClasses } from '../../utils/theme';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { Note } from '../../types';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { notes, currentView, selectedTag, theme, searchQuery } = useSelector((state: RootState) => state.notes);
  const themeClasses = getThemeClasses(theme);

  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((note: Note) => {
      note.tags.forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Calculate counts based on current view and search
  const getFilteredNotes = React.useMemo(() => {
    let filtered = notes.filter((note: Note) => 
      currentView === 'archived' ? note.isArchived : !note.isArchived
    );

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((note: Note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [notes, currentView, searchQuery]);

  const activeNotes = getFilteredNotes.filter((note: Note) => !note.isArchived);
  const archivedNotes = getFilteredNotes.filter((note: Note) => note.isArchived);

  const handleViewChange = (view: 'all' | 'archived') => {
    dispatch(setCurrentView(view));
    dispatch(setSelectedTag(null));
  };

  const handleTagSelect = (tag: string) => {
    console.log('Sidebar - Tag clicked:', tag);
    console.log('Sidebar - Current selectedTag:', selectedTag);
    
    if (selectedTag === tag) {
      console.log('Sidebar - Deselecting tag');
      dispatch(setSelectedTag(null));
    } else {
      console.log('Sidebar - Selecting tag:', tag);
      dispatch(setSelectedTag(tag));
      dispatch(setCurrentView('all'));
    }
  };

  // Calculate tag counts based on current filters
  const getTagCount = (tag: string) => {
    return getFilteredNotes.filter((note: Note) => note.tags.includes(tag)).length;
  };

  return (
    <div className={`w-64 ${themeClasses.sidebar} border-r ${themeClasses.border} flex flex-col`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${themeClasses.primary} bg-opacity-10`}>
              <PenTool className={`w-5 h-5 ${themeClasses.primary}`} />
            </div>
            <h1 className="text-xl font-semibold">Notes</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <nav className="space-y-2">
            <button
              onClick={() => handleViewChange('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'all' && !selectedTag
                  ? `${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>All Notes</span>
              <span className="ml-auto text-sm bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                {currentView === 'all' ? getFilteredNotes.length : notes.filter((note: Note) => !note.isArchived).length}
              </span>
            </button>

            <button
              onClick={() => handleViewChange('archived')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                currentView === 'archived'
                  ? `${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Archived Notes</span>
              <span className="ml-auto text-sm bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded">
                {currentView === 'archived' ? getFilteredNotes.length : notes.filter((note: Note) => note.isArchived).length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <Tag className="w-3 h-3" />
              Tags
            </h3>
            <div className="space-y-1">
              {allTags.map((tag) => {
                const tagCount = getTagCount(tag);
                
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded text-sm text-left transition-colors ${
                      selectedTag === tag
                        ? `${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span>#{tag}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                      {tagCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;