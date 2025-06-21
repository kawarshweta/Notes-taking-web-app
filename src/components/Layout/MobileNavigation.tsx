import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentView, setSelectedTag, startCreatingNote } from '../../store/notesSlice';
import { Home, Search, Archive, Tag, Settings } from 'lucide-react';
import { getThemeClasses } from '../../utils/theme';

const MobileNavigation: React.FC = () => {
  const dispatch = useDispatch();
  const { currentView, selectedTag, theme } = useSelector((state: RootState) => state.notes);
  const themeClasses = getThemeClasses(theme);

  const handleHomeClick = () => {
    dispatch(setCurrentView('all'));
    dispatch(setSelectedTag(null));
  };

  const handleArchiveClick = () => {
    dispatch(setCurrentView('archived'));
    dispatch(setSelectedTag(null));
  };

  const handleTagsClick = () => {
    // This could open a tags modal or navigate to tags view
    // For now, we'll just clear any selected tag
    dispatch(setSelectedTag(null));
  };

  return (
    <div className={`${themeClasses.surface} border-t ${themeClasses.border} px-4 py-2 safe-area-bottom`}>
      <div className="flex items-center justify-around">
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            currentView === 'all' && !selectedTag
              ? `${themeClasses.primary}`
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-medium">Home</span>
        </button>

        <button
          onClick={() => {/* Handle search */}}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <Search className="w-5 h-5" />
          <span className="text-xs font-medium">Search</span>
        </button>

        <button
          onClick={handleArchiveClick}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            currentView === 'archived'
              ? `${themeClasses.primary}`
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Archive className="w-5 h-5" />
          <span className="text-xs font-medium">Archived</span>
        </button>

        <button
          onClick={handleTagsClick}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
            selectedTag
              ? `${themeClasses.primary}`
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="text-xs font-medium">Tags</span>
        </button>

        <button
          onClick={() => {/* Handle settings */}}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;