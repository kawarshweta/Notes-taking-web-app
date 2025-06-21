import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { setTheme, setSortBy, setAutoSave, setCompactView, importNotes, clearAllData } from '../../store/notesSlice';
import { X, Palette, Type, Monitor, ChevronDown, Download, Upload, Save, Eye, Shield, Keyboard, Trash2, RefreshCw } from 'lucide-react';
import { getThemeClasses } from '../../utils/theme';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { theme, notes, sortBy, autoSave, compactView } = useSelector((state: RootState) => state.notes);
  const themeClasses = getThemeClasses(theme);
  const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [isViewDropdownOpen, setIsViewDropdownOpen] = useState(false);
  // Removed local state - now using Redux state
  const [showShortcuts, setShowShortcuts] = useState(false);
  const colorDropdownRef = useRef<HTMLDivElement>(null);
  const fontDropdownRef = useRef<HTMLDivElement>(null);
  const viewDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorDropdownRef.current && !colorDropdownRef.current.contains(event.target as Node)) {
        setIsColorDropdownOpen(false);
      }
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target as Node)) {
        setIsFontDropdownOpen(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(event.target as Node)) {
        setIsViewDropdownOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
      }, [isOpen, isColorDropdownOpen, isFontDropdownOpen, isViewDropdownOpen]);

  if (!isOpen) return null;

  const handleThemeColorChange = (color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'indigo' | 'teal' | 'red' | 'yellow' | 'cyan') => {
    dispatch(setTheme({ color }));
    setIsColorDropdownOpen(false);
  };

  const handleFontChange = (font: 'inter' | 'roboto' | 'system' | 'open-sans' | 'source-sans' | 'poppins' | 'lato' | 'montserrat') => {
    dispatch(setTheme({ font }));
    setIsFontDropdownOpen(false);
  };

  const handleModeChange = (mode: 'light' | 'dark') => {
    dispatch(setTheme({ mode }));
  };

  const colorOptions = [
    { name: 'Ocean Blue', value: 'blue', gradient: 'bg-gradient-to-r from-blue-400 to-blue-600' },
    { name: 'Royal Purple', value: 'purple', gradient: 'bg-gradient-to-r from-purple-400 to-purple-600' },
    { name: 'Forest Green', value: 'green', gradient: 'bg-gradient-to-r from-green-400 to-green-600' },
    { name: 'Sunset Orange', value: 'orange', gradient: 'bg-gradient-to-r from-orange-400 to-orange-600' },
    { name: 'Cherry Pink', value: 'pink', gradient: 'bg-gradient-to-r from-pink-400 to-pink-600' },
    { name: 'Deep Indigo', value: 'indigo', gradient: 'bg-gradient-to-r from-indigo-400 to-indigo-600' },
    { name: 'Ocean Teal', value: 'teal', gradient: 'bg-gradient-to-r from-teal-400 to-teal-600' },
    { name: 'Vibrant Red', value: 'red', gradient: 'bg-gradient-to-r from-red-400 to-red-600' },
    { name: 'Golden Yellow', value: 'yellow', gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-600' },
    { name: 'Electric Cyan', value: 'cyan', gradient: 'bg-gradient-to-r from-cyan-400 to-cyan-600' },
  ];

  const fontOptions = [
    { name: 'Inter', value: 'inter', description: 'Modern and clean' },
    { name: 'Roboto', value: 'roboto', description: 'Google\'s signature font' },
    { name: 'Open Sans', value: 'open-sans', description: 'Friendly and readable' },
    { name: 'Source Sans Pro', value: 'source-sans', description: 'Professional and elegant' },
    { name: 'Poppins', value: 'poppins', description: 'Geometric and friendly' },
    { name: 'Lato', value: 'lato', description: 'Humanist and warm' },
    { name: 'Montserrat', value: 'montserrat', description: 'Urban and stylish' },
    { name: 'System Default', value: 'system', description: 'Your device\'s font' },
  ];

  const viewOptions = [
    { name: 'Recently Updated', value: 'updated', description: 'Show newest changes first' },
    { name: 'Recently Created', value: 'created', description: 'Show newest notes first' },
    { name: 'Alphabetical', value: 'alphabetical', description: 'Sort by title A-Z' },
    { name: 'By Tags', value: 'tags', description: 'Group by tags' },
  ];

  const handleExportNotes = () => {
    const notesData = JSON.stringify(notes, null, 2);
    const blob = new Blob([notesData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportNotes = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedNotes = JSON.parse(e.target?.result as string);
            if (Array.isArray(importedNotes)) {
              dispatch(importNotes(importedNotes));
              alert('Notes imported successfully!');
            } else {
              alert('Invalid file format. Please select a valid notes backup file.');
            }
          } catch (error) {
            alert('Error importing notes. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all notes? This action cannot be undone.')) {
      dispatch(clearAllData());
      localStorage.clear();
      alert('All data cleared!');
    }
  };

  const modeOptions = [
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
  ];

  // New handler functions for Redux actions
  const handleSortByChange = (sortValue: 'updated' | 'created' | 'alphabetical' | 'tags') => {
    dispatch(setSortBy(sortValue));
    setIsViewDropdownOpen(false);
  };

  const handleAutoSaveToggle = () => {
    dispatch(setAutoSave(!autoSave));
  };

  const handleCompactViewToggle = () => {
    dispatch(setCompactView(!compactView));
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsColorDropdownOpen(false);
          setIsFontDropdownOpen(false);
        }
      }}
    >
      <div className={`${themeClasses.surface} rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Theme Color */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4" />
              <h3 className="font-medium">Theme Color</h3>
            </div>
            <div className="relative" ref={colorDropdownRef}>
              <button
                onClick={() => setIsColorDropdownOpen(!isColorDropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className={`w-5 h-5 rounded-full ${colorOptions.find(c => c.value === theme.color)?.gradient} shadow-sm`} />
                <span className="text-sm font-medium flex-1 text-left">
                  {colorOptions.find(c => c.value === theme.color)?.name}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isColorDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isColorDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeColorChange(option.value as any)}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        theme.color === option.value ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${option.gradient} shadow-sm`} />
                      <span className="text-sm font-medium flex-1 text-left">{option.name}</span>
                      {theme.color === option.value && (
                        <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Font Family */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4" />
              <h3 className="font-medium">Font Family</h3>
            </div>
            <div className="relative" ref={fontDropdownRef}>
              <button
                onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{ 
                  fontFamily: theme.font === 'system' 
                    ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
                    : theme.font === 'open-sans' 
                    ? '"Open Sans", sans-serif'
                    : theme.font === 'source-sans'
                    ? '"Source Sans Pro", sans-serif'
                    : `"${theme.font}", sans-serif`
                }}
              >
                <Type className="w-4 h-4 opacity-60" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">
                    {fontOptions.find(f => f.value === theme.font)?.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {fontOptions.find(f => f.value === theme.font)?.description}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isFontDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {fontOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontChange(option.value as any)}
                      className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        theme.font === option.value ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                      style={{ 
                        fontFamily: option.value === 'system' 
                          ? 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' 
                          : option.value === 'open-sans' 
                          ? '"Open Sans", sans-serif'
                          : option.value === 'source-sans'
                          ? '"Source Sans Pro", sans-serif'
                          : `"${option.value}", sans-serif`
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{option.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{option.description}</div>
                          <div className="text-xs opacity-60">Sample: The quick brown fox</div>
                        </div>
                        {theme.font === option.value && (
                          <div className="w-2 h-2 bg-current rounded-full opacity-60 ml-3" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Display Mode */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Monitor className="w-4 h-4" />
              <h3 className="font-medium">Display Mode</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {modeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleModeChange(option.value as any)}
                  className={`p-3 rounded-lg border transition-colors ${
                    theme.mode === option.value
                      ? `border-${theme.color}-500 bg-${theme.color}-50 dark:bg-${theme.color}-900/20`
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* View Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4" />
              <h3 className="font-medium">Default View</h3>
            </div>
            <div className="relative" ref={viewDropdownRef}>
              <button
                onClick={() => setIsViewDropdownOpen(!isViewDropdownOpen)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Eye className="w-4 h-4 opacity-60" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">
                    {viewOptions.find(v => v.value === sortBy)?.name || 'Recently Updated'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {viewOptions.find(v => v.value === sortBy)?.description || 'Show newest changes first'}
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isViewDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isViewDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  {viewOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortByChange(option.value as any)}
                      className={`w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        sortBy === option.value ? 'bg-gray-50 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-medium mb-1">{option.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                        </div>
                        {sortBy === option.value && (
                          <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Save className="w-4 h-4" />
              <h3 className="font-medium">Preferences</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Auto-save</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Automatically save changes</div>
                </div>
                <button
                  onClick={handleAutoSaveToggle}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoSave ? themeClasses.primaryBg : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      autoSave ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">Compact View</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Show more notes in less space</div>
                </div>
                <button
                  onClick={handleCompactViewToggle}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    compactView ? themeClasses.primaryBg : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      compactView ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" />
              <h3 className="font-medium">Data Management</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleExportNotes}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4 text-green-600 dark:text-green-400" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Export Notes</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Download backup as JSON</div>
                </div>
              </button>

              <button
                onClick={handleImportNotes}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Import Notes</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Load notes from backup file</div>
                </div>
              </button>

              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Keyboard className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">Keyboard Shortcuts</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">View available shortcuts</div>
                </div>
              </button>

              {showShortcuts && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border">
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between">
                      <span>New Note:</span>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl + N</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Search:</span>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl + F</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Save:</span>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl + S</code>
                    </div>
                    <div className="flex justify-between">
                      <span>Settings:</span>
                      <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">Ctrl + ,</code>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleClearAllData}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">Clear All Data</div>
                  <div className="text-xs text-red-500 dark:text-red-400">Delete all notes permanently</div>
                </div>
              </button>
            </div>
          </div>

          {/* App Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-medium mb-2">About</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>Notes App v1.0.0</p>
              <p>A modern note-taking application</p>
              <p className="text-xs mt-2">
                Total Notes: <span className="font-medium">{notes.length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className={`px-4 py-2 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 