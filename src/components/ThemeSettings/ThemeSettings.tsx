import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setTheme } from '../../store/notesSlice';
import { X, Palette, Type, Sun, Moon } from 'lucide-react';
import { Theme } from '../../types';
import { getThemeClasses } from '../../utils/theme';

interface ThemeSettingsProps {
  onClose: () => void;
}

const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.notes.theme);
  const themeClasses = getThemeClasses(theme);

  const colorOptions: Array<{ value: Theme['color']; name: string; class: string }> = [
    { value: 'blue', name: 'Blue', class: 'bg-blue-500' },
    { value: 'purple', name: 'Purple', class: 'bg-purple-500' },
    { value: 'green', name: 'Green', class: 'bg-green-500' },
    { value: 'orange', name: 'Orange', class: 'bg-orange-500' },
  ];

  const fontOptions: Array<{ value: Theme['font']; name: string; class: string }> = [
    { value: 'inter', name: 'Inter', class: 'font-sans' },
    { value: 'roboto', name: 'Roboto', class: 'font-sans' },
    { value: 'system', name: 'System', class: 'font-sans' },
  ];

  const handleColorChange = (color: Theme['color']) => {
    dispatch(setTheme({ color }));
  };

  const handleFontChange = (font: Theme['font']) => {
    dispatch(setTheme({ font }));
  };

  const handleModeToggle = () => {
    dispatch(setTheme({ mode: theme.mode === 'light' ? 'dark' : 'light' }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`w-96 ${themeClasses.surface} rounded-lg shadow-xl border ${themeClasses.border}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">Theme Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Color Theme */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleColorChange(option.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    theme.color === option.value
                      ? `border-${option.value}-500 bg-${option.value}-50 dark:bg-${option.value}-900/20`
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${option.class}`} />
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Font Family
            </h3>
            <div className="space-y-2">
              {fontOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFontChange(option.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                    theme.font === option.value
                      ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20`
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } ${option.class}`}
                >
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Appearance Mode
            </h3>
            <button
              onClick={handleModeToggle}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                {theme.mode === 'dark' ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                <span>{theme.mode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors ${
                  theme.mode === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform mt-1 ${
                    theme.mode === 'dark' ? 'transform translate-x-5' : 'transform translate-x-1'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;