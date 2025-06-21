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
  Plus
} from 'lucide-react';
import { formatDate } from '../../utils/date';
import { getThemeClasses } from '../../utils/theme';
import { ValidationErrors } from '../../types';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

const NoteEditor: React.FC = () => {
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

  // Mobile Notes List View
  if (showMobileNotesList) {
    return (
      <div className={`flex-1 ${themeClasses.surface} flex flex-col`}>
        {/* Mobile Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{getViewTitle()}</h2>
          <div className="flex items-center gap-2">
            {currentView !== 'archived' && (
              <button
                onClick={handleCreateNote}
                className={`p-2 ${themeClasses.primary} text-white rounded-lg hover:opacity-90 transition-opacity`}
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
            <ThemeToggle />
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
        <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={() => setShowMobileNotesList(true)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{getViewTitle()}</span>
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
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {/* Mobile Back Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setShowMobileNotesList(true)}
            className="p-1 text-gray-600 dark:text-gray-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-500">Go Back</span>
        </div>

        {/* Desktop Header Info */}
        <div className="hidden md:flex items-center gap-4">
          {currentNote?.tags && currentNote.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex gap-1">
                {currentNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded text-xs ${themeClasses.primary} bg-opacity-10 ${themeClasses.primary}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {currentNote?.updatedAt && !isCreatingNote && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>Last edited {formatDate(currentNote.updatedAt)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Mobile Theme Toggle */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>

          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-3 py-1.5 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Note</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            </>
          ) : (
            selectedNote && (
              <>
                <button
                  onClick={handleEdit}
                  className={`flex items-center gap-2 px-3 py-1.5 ${themeClasses.primaryBg} text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Note</span>
                </button>
                <button
                  onClick={handleArchiveToggle}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  {selectedNote.isArchived ? (
                    <ArchiveRestore className="w-4 h-4" />
                  ) : (
                    <Archive className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {selectedNote.isArchived ? 'Unarchive' : 'Archive'}
                  </span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </>
            )
          )}
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

            {/* Content Input */}
            <div className="flex-1">
              <textarea
                placeholder="Start writing your note..."
                value={currentNote?.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className={`w-full h-96 p-0 bg-transparent border-none outline-none resize-none placeholder-gray-400 leading-relaxed ${
                  errors.content ? 'text-red-500' : ''
                }`}
              />
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
                <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                  {currentNote.content}
                </pre>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default NoteEditor;