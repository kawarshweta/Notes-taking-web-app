import React from 'react';
import { getThemeClasses } from '../../utils/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface PlainTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const PlainTextEditor: React.FC<PlainTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your note...",
  className = ""
}) => {
  const { theme } = useSelector((state: RootState) => state.notes);
  const themeClasses = getThemeClasses(theme);

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg ${themeClasses.surface} ${className}`}>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-96 p-4 bg-transparent border-none outline-none resize-none placeholder-gray-400 leading-relaxed ${themeClasses.text}`}
      />
    </div>
  );
};

export default PlainTextEditor; 