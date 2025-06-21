import React, { useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setCurrentView, startCreatingNote } from '../../store/notesSlice';
import { Home, Search, Archive, Tag, Settings, Menu, FileText, Plus } from 'lucide-react';
import { getThemeClasses } from '../../utils/theme';
import { TagFilterContext } from './Layout';
import SettingsModal from '../Settings/Settings';

interface MobileNavigationProps {
  onMenuClick?: () => void;
  onNotesClick?: () => void;
  onCreateNote?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ onMenuClick, onNotesClick, onCreateNote }) => {
  const dispatch = useDispatch();
  const { currentView, theme } = useSelector((state: RootState) => state.notes);
  const { selectedTag, setSelectedTag } = useContext(TagFilterContext);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const themeClasses = getThemeClasses(theme);

  const handleHomeClick = () => {
    dispatch(setCurrentView('all'));
    setSelectedTag(null);
  };

  const handleArchiveClick = () => {
    dispatch(setCurrentView('archived'));
    setSelectedTag(null);
  };

  const handleCreateNote = () => {
    dispatch(startCreatingNote());
    onCreateNote?.();
  };

  return (
    <div className={`sticky bottom-0 ${themeClasses.surface} border-t ${themeClasses.border} px-4 py-2 safe-area-bottom z-10`}>
      <div className="flex items-center justify-around">
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs font-medium">Menu</span>
        </button>

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
          onClick={onNotesClick}
          className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <FileText className="w-5 h-5" />
          <span className="text-xs font-medium">Notes</span>
        </button>

        <button
          onClick={handleCreateNote}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${themeClasses.primaryBg} text-white`}
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-medium">New</span>
        </button>

        <button
          onClick={handleArchiveClick}
          className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors ${
            currentView === 'archived'
              ? `${themeClasses.primary}`
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Archive className="w-5 h-5" />
          <span className="text-xs font-medium">Archive</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs font-medium">Settings</span>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

export default MobileNavigation;