import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Note } from '../../types';
import { formatDate } from '../../utils/date';
import { getThemeClasses } from '../../utils/theme';
import { isHtmlContent, htmlToPlainText } from '../../utils/contentUtils';

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, isSelected, onClick, compact = false }) => {
  const theme = useSelector((state: RootState) => state.notes.theme);
  const themeClasses = getThemeClasses(theme);

  const truncateContent = (content: string, maxLength: number) => {
    // Convert HTML to plain text for preview
    const plainContent = isHtmlContent(content) ? htmlToPlainText(content) : content;
    if (plainContent.length <= maxLength) return plainContent;
    return plainContent.substr(0, maxLength) + '...';
  };

  return (
    <div
      onClick={onClick}
      className={`${compact ? 'p-2' : 'p-4'} cursor-pointer border-l-2 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
        isSelected
          ? `border-l-blue-500 ${themeClasses.primary} bg-opacity-5`
          : 'border-l-transparent'
      }`}
    >
      <div className={compact ? 'space-y-1' : 'space-y-2'}>
        <h3 className={`font-medium text-gray-900 dark:text-gray-100 ${compact ? 'line-clamp-1 text-sm' : 'line-clamp-2'}`}>
          {note.title}
        </h3>
        
        {!compact && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {truncateContent(note.content, 120)}
          </p>
        )}
        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, compact ? 2 : 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 rounded ${compact ? 'text-xs' : 'text-xs'} ${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`}
              >
                {tag}
              </span>
            ))}
            {note.tags.length > (compact ? 2 : 3) && (
              <span className={`px-2 py-0.5 rounded ${compact ? 'text-xs' : 'text-xs'} bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400`}>
                +{note.tags.length - (compact ? 2 : 3)}
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