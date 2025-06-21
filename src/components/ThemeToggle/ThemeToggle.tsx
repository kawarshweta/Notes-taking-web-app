import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setTheme } from '../../store/notesSlice';
import { Sun, Moon } from 'lucide-react';
import { getThemeClasses } from '../../utils/theme';

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.notes.theme);
  const themeClasses = getThemeClasses(theme);

  const handleToggle = () => {
    dispatch(setTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' }));
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${themeClasses.text}`}
      title={`Switch to ${theme.mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme.mode === 'dark' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle;