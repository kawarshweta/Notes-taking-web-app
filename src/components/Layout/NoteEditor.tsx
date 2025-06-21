import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { 
  createNote, 
  updateNote, 
  deleteNote, 
  archiveNote, 
  unarchiveNote,
  setEditingNote,
  cancelEditing,
  startCreatingNote
} from '../../store/notesSlice';
import { 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Tag, 
  Calendar, 
  Save, 
  X, 
  Edit3, 
  ArrowLeft,
  FileText,
  Plus,
  Type,
  Code2
} from 'lucide-react';
import { formatDate } from '../../utils/date';
import { getThemeClasses } from '../../utils/theme';
import { isHtmlContent, htmlToPlainText, plainTextToHtml } from '../../utils/contentUtils';
import { ValidationErrors } from '../../types';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import RichTextEditor from '../Editor/RichTextEditor';
import PlainTextEditor from '../Editor/PlainTextEditor';

interface NoteEditorProps {
  onBackToList?: () => void;
  showBackButton?: boolean;
  isMobile?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  onBackToList, 
  showBackButton = false, 
  isMobile = false 
}) => {
  const dispatch = useDispatch();
  const { 
    notes, 
    selectedNoteId, 
    currentView, 
    theme, 
    isCreatingNote, 
    editingNote,
    selectedTag,
    searchQuery
  } = useSelector((state: RootState) => state.notes);
  
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showMobileNotesList, setShowMobileNotesList] = useState(false);
  const [isRichTextMode, setIsRichTextMode] = useState(true);
  const titleRef = useRef<HTMLInputElement>(null);
  const themeClasses = getThemeClasses(theme);

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;
  const isEditing = isCreatingNote || editingNote !== null;
  const currentNote = editingNote || selectedNote;

  // Filter notes for mobile view
  const filteredNotes = React.useMemo(() => {
    let filtered = notes.filter(note => 
      currentView === 'archived' ? note.isArchived : !note.isArchived
    );

    if (selectedTag) {
      filtered = filtered.filter(note => note.tags.includes(selectedTag));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes, currentView, selectedTag, searchQuery]);

  useEffect(() => {
    if (currentNote?.tags) {
      setTagsInput(currentNote.tags.join(', '));
    }
  }, [currentNote?.id]);

  useEffect(() => {
    if (isCreatingNote && titleRef.current) {
      titleRef.current.focus();
    }
  }, [isCreatingNote]);

  // Set editor mode based on content format when editing an existing note
  useEffect(() => {
    if (currentNote?.content && !isCreatingNote) {
      setIsRichTextMode(isHtmlContent(currentNote.content));
    }
  }, [currentNote?.id, isCreatingNote]);

  const validateNote = (title: string, content: string): ValidationErrors => {
    const errors: ValidationErrors = {};
    if (!title.trim()) {
      errors.title = 'Title is required';
    }
    if (!content.trim()) {
      errors.content = 'Content is required';
    }
    return errors;
  };

  const handleSave = () => {
    if (!currentNote) return;

    const title = currentNote.title || '';
    const content = currentNote.content || '';
    const validationErrors = validateNote(title, content);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    if (isCreatingNote) {
      dispatch(createNote({
        title,
        content,
        tags,
      }));
      // On mobile, go back to notes list after creating
      if (isMobile && onBackToList) {
        onBackToList();
      }
    } else if (selectedNoteId) {
      dispatch(updateNote({
        id: selectedNoteId,
        updates: {
          title,
          content,
          tags,
        },
      }));
    }
  };

  const handleCancel = () => {
    setErrors({});
    dispatch(cancelEditing());
    // On mobile, go back to notes list when canceling
    if (isMobile && onBackToList) {
      onBackToList();
    }
  };

  const handleEdit = () => {
    if (selectedNote) {
      dispatch(setEditingNote(selectedNote));
    }
  };

  const handleDelete = () => {
    if (selectedNoteId && confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(selectedNoteId));
    }
  };

  const handleArchiveToggle = () => {
    if (selectedNoteId) {
      if (selectedNote?.isArchived) {
        dispatch(unarchiveNote(selectedNoteId));
      } else {
        dispatch(archiveNote(selectedNoteId));
      }
    }
  };

  const handleTitleChange = (value: string) => {
    if (errors.title && value.trim()) {
      setErrors(prev => ({ ...prev, title: undefined }));
    }
    dispatch(setEditingNote({
      ...currentNote,
      title: value,
    }));
  };

  const handleContentChange = (value: string) => {
    if (errors.content && value.trim()) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
    dispatch(setEditingNote({
      ...currentNote,
      content: value,
    }));
  };

  const handleCreateNote = () => {
    dispatch(startCreatingNote());
  };

  const getViewTitle = () => {
    if (selectedTag) return `#${selectedTag}`;
    return currentView === 'archived' ? 'Archived Notes' : 'All Notes';
  };

  const handleEditorModeToggle = () => {
    if (!currentNote) return;
    
    let convertedContent = currentNote.content || '';
    
    if (isRichTextMode) {
      // Converting from rich text to plain text
      convertedContent = htmlToPlainText(convertedContent);
    } else {
      // Converting from plain text to rich text
      convertedContent = plainTextToHtml(convertedContent);
    }
    
    dispatch(setEditingNote({
      ...currentNote,
      content: convertedContent,
    }));
    
    setIsRichTextMode(!isRichTextMode);
  };

  // Mobile Notes List View
  if (showMobileNotesList) {
    return (
      <div className={`flex-1 ${themeClasses.surface} flex flex-col`}>
        {/* Mobile Header */}
        <div className="p-4 sm:p-6 lg:p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl lg:text-lg font-semibold truncate">{getViewTitle()}</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {currentView !== 'archived' && (
                <button
                  onClick={handleCreateNote}
                  className={`p-2 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity`}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-2">
                {searchQuery ? 'No notes match your search' : currentView === 'archived' ? 'No archived notes' : 'No notes yet'}
              </div>
              {!searchQuery && currentView !== 'archived' && (
                <button
                  onClick={handleCreateNote}
                  className={`text-sm ${themeClasses.primary} hover:underline`}
                >
                  Create your first note
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotes.map(note => (
                <div
                  key={note.id}
                  onClick={() => {
                    dispatch({ type: 'notes/setSelectedNoteId', payload: note.id });
                    setShowMobileNotesList(false);
                  }}
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-2">
                    {note.content.substring(0, 120)}...
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-0.5 rounded text-xs ${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(note.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // No note selected state
  if (!currentNote && !isCreatingNote) {
    return (
      <div className={`flex-1 ${themeClasses.surface} flex flex-col`}>
        {/* Mobile Header */}
        <div className="md:hidden p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setShowMobileNotesList(true)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">{getViewTitle()}</span>
          </button>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a note to view</p>
              <p className="text-sm">Choose a note from the sidebar to start reading</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 ${themeClasses.surface} flex flex-col`}>
      {/* Header */}
      <div className="p-4 sm:p-6 lg:p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {/* Left Section - Back Button or Empty */}
          <div className="flex items-center min-w-0 flex-1">
            {showBackButton && (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={onBackToList}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <span className="text-sm sm:text-base text-gray-500 hidden xs:inline">Go Back</span>
              </div>
            )}
            
            {/* Desktop Header Info - Tags and Date */}
            {!showBackButton && (
              <div className="hidden lg:flex items-center gap-4 min-w-0 flex-1">
                {currentNote?.tags && currentNote.tags.length > 0 && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div className="flex gap-1 flex-wrap min-w-0">
                      {currentNote.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${themeClasses.primary} bg-opacity-10 ${themeClasses.primary} whitespace-nowrap`}
                        >
                          {tag}
                        </span>
                      ))}
                      {currentNote.tags.length > 3 && (
                        <span className="px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400">
                          +{currentNote.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {currentNote?.updatedAt && !isCreatingNote && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                    <span className="hidden xl:inline">Last edited {formatDate(currentNote.updatedAt)}</span>
                    <span className="xl:hidden">{formatDate(currentNote.updatedAt)}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Mobile Theme Toggle */}
            <div className="md:hidden">
              <ThemeToggle />
            </div>

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                >
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline lg:hidden xl:inline">Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline lg:hidden xl:inline">Cancel</span>
                </button>
              </>
            ) : (
              selectedNote && (
                <>
                  <button
                    onClick={handleEdit}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline lg:hidden xl:inline">Edit</span>
                  </button>
                  <button
                    onClick={handleArchiveToggle}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                  >
                    {selectedNote.isArchived ? (
                      <ArchiveRestore className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                    <span className="hidden lg:inline xl:hidden">
                      {selectedNote.isArchived ? 'Restore' : 'Archive'}
                    </span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden lg:inline xl:hidden">Delete</span>
                  </button>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isEditing ? (
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <input
                ref={titleRef}
                type="text"
                placeholder="Note title..."
                value={currentNote?.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 ${
                  errors.title ? 'text-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (separated by commas)
              </label>
              <input
                type="text"
                placeholder="tag1, tag2, tag3..."
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className={`w-full px-3 py-2 border ${themeClasses.border} rounded-lg ${themeClasses.input} placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>

            {/* Editor Mode Toggle */}
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content
              </label>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${!isRichTextMode ? 'text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                  Rich Text
                </span>
                <button
                  onClick={handleEditorModeToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isRichTextMode ? themeClasses.primaryBg : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isRichTextMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${isRichTextMode ? 'text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                  Plain Text
                </span>
              </div>
            </div>

            {/* Content Input */}
            <div className="flex-1">
              {isRichTextMode ? (
                <RichTextEditor
                  content={currentNote?.content || ''}
                  onChange={handleContentChange}
                  placeholder="Start writing your note..."
                />
              ) : (
                <PlainTextEditor
                  content={currentNote?.content || ''}
                  onChange={handleContentChange}
                  placeholder="Start writing your note..."
                />
              )}
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
            </div>
          </div>
        ) : (
          currentNote && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold leading-tight">
                {currentNote.title}
              </h1>
              
              {/* Mobile Tags and Date */}
              <div className="md:hidden space-y-3">
                {currentNote.tags && currentNote.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {currentNote.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                {currentNote.updatedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Last edited {formatDate(currentNote.updatedAt)}</span>
                  </div>
                )}
              </div>

              <div className="prose prose-lg max-w-none dark:prose-invert">
                {currentNote.content && isHtmlContent(currentNote.content) ? (
                  // Rich text content (HTML)
                  <div dangerouslySetInnerHTML={{ __html: currentNote.content }} />
                ) : (
                  // Plain text content
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                    {currentNote.content || ''}
                  </pre>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NoteEditor;