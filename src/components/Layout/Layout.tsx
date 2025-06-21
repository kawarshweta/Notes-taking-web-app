import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Sidebar from './Sidebar';
import NotesPanel from './NotesPanel';
import NoteEditor from './NoteEditor';
import MobileNavigation from './MobileNavigation';
import { getThemeClasses } from '../../utils/theme';

const Layout: React.FC = () => {
  const theme = useSelector((state: RootState) => state.notes.theme);
  const themeClasses = getThemeClasses(theme);

  return (
    <div className={`min-h-screen flex flex-col ${themeClasses.background} ${themeClasses.text} ${themeClasses.font} transition-colors duration-200`}>
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1">
        <Sidebar />
        <NotesPanel />
        <NoteEditor />
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="md:hidden flex flex-col flex-1">
        <NoteEditor />
        <MobileNavigation />
      </div>
    </div>
  );
};

export default Layout;