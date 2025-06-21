import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setSelectedNoteId } from '../../store/notesSlice';
import Sidebar from './Sidebar';
import NotesPanel from './NotesPanel';
import NoteEditor from './NoteEditor';
import MobileNavigation from './MobileNavigation';
import { getThemeClasses } from '../../utils/theme';
import { Menu, X } from 'lucide-react';

// Create a context for tag filtering
export const TagFilterContext = React.createContext<{
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}>({
  selectedTag: null,
  setSelectedTag: () => {},
});

const Layout: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.notes.theme);
  const { selectedNoteId, isCreatingNote } = useSelector((state: RootState) => state.notes);
  const themeClasses = getThemeClasses(theme);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileNotesListOpen, setIsMobileNotesListOpen] = useState(true);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Handle screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
        setIsSidebarOpen(false);
      } else if (width < 1024) {
        setScreenSize('tablet');
        setIsSidebarOpen(false);
      } else {
        setScreenSize('desktop');
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar when clicking outside on mobile/tablet
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && screenSize !== 'desktop') {
        const sidebar = document.getElementById('mobile-sidebar');
        if (sidebar && !sidebar.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, screenSize]);

  // Mobile: Show notes list by default, editor when note selected or creating
  const showNotesListOnMobile = screenSize === 'mobile' && (isMobileNotesListOpen && !selectedNoteId && !isCreatingNote);
  const showEditorOnMobile = screenSize === 'mobile' && (selectedNoteId || isCreatingNote || !isMobileNotesListOpen);

  return (
    <TagFilterContext.Provider value={{ selectedTag, setSelectedTag }}>
      <div className={`min-h-screen flex flex-col ${themeClasses.background} ${themeClasses.text} ${themeClasses.font} transition-colors duration-200`}>
        
        {/* Mobile Header - Only on mobile */}
        {screenSize === 'mobile' && (
          <div className={`${themeClasses.surface} border-b ${themeClasses.border} p-4 sm:p-6 lg:hidden`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-lg sm:text-xl font-semibold">Notes</h1>
              </div>
              <div className="w-11 flex-shrink-0" /> {/* Spacer for center alignment */}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-1 relative">
          
          {/* Sidebar - Responsive */}
          <div className={`
            ${screenSize === 'desktop' ? 'relative' : 'fixed inset-0 z-50'}
            ${screenSize === 'desktop' ? 'flex' : isSidebarOpen ? 'flex' : 'hidden'}
          `}>
            {screenSize !== 'desktop' && isSidebarOpen && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            <div id="mobile-sidebar" className={`
              ${screenSize === 'desktop' ? 'w-64 h-full' : 'w-80 h-full relative z-50'}
              ${screenSize !== 'desktop' ? 'shadow-xl' : ''}
            `}>
              <Sidebar 
                onClose={() => {
                  setIsSidebarOpen(false);
                  // Show notes list when sidebar closes on mobile after selection
                  if (screenSize === 'mobile') {
                    setIsMobileNotesListOpen(true);
                    // Clear selected note and creating state to ensure notes list shows
                    dispatch(setSelectedNoteId(null));
                  }
                }} 
                showCloseButton={screenSize !== 'desktop'}
              />
            </div>
          </div>

          {/* Content Area - Notes Panel + Editor */}
          <div className="flex flex-1 min-w-0">
            
            {/* Notes Panel - Responsive */}
            <div className={`
              ${screenSize === 'mobile' ? 
                (showNotesListOnMobile ? 'flex' : 'hidden') : 
                screenSize === 'tablet' ? 
                  'w-80 flex-shrink-0' : 
                  'w-80 flex-shrink-0'
              }
              ${screenSize === 'mobile' ? 'w-full' : ''}
              flex flex-col
            `}>
              <NotesPanel 
                onNoteSelect={() => {
                  if (screenSize === 'mobile') {
                    setIsMobileNotesListOpen(false);
                  }
                }}
                onBackToList={() => {
                  if (screenSize === 'mobile') {
                    setIsMobileNotesListOpen(true);
                  }
                }}
                showBackButton={screenSize === 'mobile' && !showNotesListOnMobile}
                isMobile={screenSize === 'mobile'}
              />
            </div>

            {/* Note Editor - Responsive */}
            <div className={`
              ${screenSize === 'mobile' ? 
                (showEditorOnMobile ? 'flex' : 'hidden') : 
                'flex'
              }
              flex-1 min-w-0
            `}>
              <NoteEditor 
                onBackToList={() => {
                  if (screenSize === 'mobile') {
                    setIsMobileNotesListOpen(true);
                  }
                }}
                showBackButton={screenSize === 'mobile'}
                isMobile={screenSize === 'mobile'}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Only on mobile */}
        {screenSize === 'mobile' && (
          <MobileNavigation 
            onMenuClick={() => setIsSidebarOpen(true)}
            onNotesClick={() => setIsMobileNotesListOpen(true)}
            onCreateNote={() => setIsMobileNotesListOpen(false)}
          />
        )}
      </div>
    </TagFilterContext.Provider>
  );
};

export default Layout;