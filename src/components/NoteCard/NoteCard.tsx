import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Note } from '../../types';
import { formatDate } from '../../utils/date';
import { getThemeClasses } from '../../utils/theme';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, isSelected, onClick }) => {
  const theme = useSelector((state: RootState) => state.notes.theme);
  const themeClasses = getThemeClasses(theme);

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer border-l-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
        isSelected
          ? `border-l-blue-500 ${themeClasses.primary} bg-opacity-5`
          : 'border-l-transparent'
      }`}
    >
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {note.title}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {truncateContent(note.content, 120)}
        </p>
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 rounded text-xs ${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`}
              >
                {tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(note.updatedAt)}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;