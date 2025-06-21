import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import ListItem from '@tiptap/extension-list-item';
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Minus, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Palette,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  CheckSquare,
  Indent,
  Outdent,
  MoreHorizontal
} from 'lucide-react';
import { getThemeClasses } from '../../utils/theme';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your note...",
  className = ""
}) => {
  const { theme } = useSelector((state: RootState) => state.notes);
  const themeClasses = getThemeClasses(theme);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: 'custom-bullet-list',
          },
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
          HTMLAttributes: {
            class: 'custom-ordered-list',
          },
        },
        listItem: false, // We'll use our own ListItem extension
      }),
      ListItem,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none dark:prose-invert focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  const addLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const setColor = (color: string) => {
    editor?.chain().focus().setColor(color).run();
  };

  const setHighlight = (color: string) => {
    editor?.chain().focus().setHighlight({ color }).run();
  };

  if (!editor) {
    return null;
  }

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }> = ({ onClick, isActive, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? `${themeClasses.primaryBg} text-white` 
          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  const ColorPicker: React.FC<{ onColorSelect: (color: string) => void; colors: string[]; title: string }> = ({ 
    onColorSelect, 
    colors, 
    title 
  }) => (
    <div className="relative group">
      <button
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title={title}
      >
        {title === 'Text Color' ? <Palette className="w-4 h-4" /> : <Highlighter className="w-4 h-4" />}
      </button>
      <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
        <div className="grid grid-cols-4 gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const ListStylePicker: React.FC = () => {
    const bulletStyles = [
      { name: 'Default Bullet', value: 'disc', symbol: '•' },
      { name: 'Circle', value: 'circle', symbol: '○' },
      { name: 'Square', value: 'square', symbol: '■' },
    ];

    const numberStyles = [
      { name: 'Numbers', value: 'decimal', symbol: '1.' },
      { name: 'Letters (a)', value: 'lower-alpha', symbol: 'a.' },
      { name: 'Letters (A)', value: 'upper-alpha', symbol: 'A.' },
      { name: 'Roman (i)', value: 'lower-roman', symbol: 'i.' },
      { name: 'Roman (I)', value: 'upper-roman', symbol: 'I.' },
    ];

    const applyBulletStyle = (style: string) => {
      if (!editor?.isActive('bulletList')) {
        editor?.chain().focus().toggleBulletList().run();
      }
      
      // Use a more direct approach by manipulating the DOM
      setTimeout(() => {
        const editorElement = editor?.view.dom;
        if (editorElement) {
          const bulletLists = editorElement.querySelectorAll('ul');
          const selection = editor?.state.selection;
          
          // Find the current list in the selection
          if (selection) {
            let currentList: HTMLUListElement | null = null;
            
            // Get the current node
            const $from = selection.$from;
            for (let i = $from.depth; i >= 0; i--) {
              const node = $from.node(i);
              if (node.type.name === 'bulletList') {
                // Find the corresponding DOM element
                const pos = $from.start(i);
                const domNode = editor?.view.nodeDOM(pos);
                if (domNode instanceof HTMLUListElement) {
                  currentList = domNode;
                  break;
                }
              }
            }
            
            if (currentList) {
              currentList.style.listStyleType = style;
              currentList.setAttribute('data-list-style', style);
              console.log('Applied bullet style:', style, 'to list:', currentList);
            }
          }
        }
      }, 100);
    };

    const applyNumberStyle = (style: string) => {
      if (!editor?.isActive('orderedList')) {
        editor?.chain().focus().toggleOrderedList().run();
      }
      
      // Use a more direct approach by manipulating the DOM
      setTimeout(() => {
        const editorElement = editor?.view.dom;
        if (editorElement) {
          const selection = editor?.state.selection;
          
          // Find the current list in the selection
          if (selection) {
            let currentList: HTMLOListElement | null = null;
            
            // Get the current node
            const $from = selection.$from;
            for (let i = $from.depth; i >= 0; i--) {
              const node = $from.node(i);
              if (node.type.name === 'orderedList') {
                // Find the corresponding DOM element
                const pos = $from.start(i);
                const domNode = editor?.view.nodeDOM(pos);
                if (domNode instanceof HTMLOListElement) {
                  currentList = domNode;
                  break;
                }
              }
            }
            
            if (currentList) {
              currentList.style.listStyleType = style;
              currentList.setAttribute('data-list-style', style);
              console.log('Applied number style:', style, 'to list:', currentList);
            }
          }
        }
      }, 100);
    };

    return (
      <div className="relative group">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="List Styles"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
        <div className="absolute top-full left-0 mt-1 hidden group-hover:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10 min-w-[160px]">
          <div className="space-y-3">
            {/* Bullet Styles */}
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">Bullet Styles</div>
              <div className="space-y-1">
                {bulletStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => applyBulletStyle(style.value)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    title={style.name}
                  >
                    <span className="font-mono text-sm w-4">{style.symbol}</span>
                    <span className="text-sm">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number Styles */}
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">Number Styles</div>
              <div className="space-y-1">
                {numberStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => applyNumberStyle(style.value)}
                    className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    title={style.name}
                  >
                    <span className="font-mono text-sm w-4">{style.symbol}</span>
                    <span className="text-sm">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const textColors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#EAB308', '#22C55E',
    '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'
  ];

  const highlightColors = [
    '#FEF3C7', '#FED7AA', '#FECACA', '#D1FAE5',
    '#DBEAFE', '#E9D5FF', '#FCE7F3', '#A7F3D0'
  ];

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg ${themeClasses.surface} ${className}`}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleTaskList().run()}
              isActive={editor.isActive('taskList')}
              title="Task List"
            >
              <CheckSquare className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* List Indentation */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
              disabled={!editor.can().sinkListItem('listItem')}
              title="Increase Indent"
            >
              <Indent className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().liftListItem('listItem').run()}
              disabled={!editor.can().liftListItem('listItem')}
              title="Decrease Indent"
            >
              <Outdent className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Blocks */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Rule"
            >
              <Minus className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            {[1, 2, 3].map((level) => (
              <ToolbarButton
                key={level}
                onClick={() => editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 }).run()}
                isActive={editor.isActive('heading', { level })}
                title={`Heading ${level}`}
              >
                <span className="text-sm font-bold">H{level}</span>
              </ToolbarButton>
            ))}
          </div>

          {/* Text Alignment */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Colors */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ColorPicker
              onColorSelect={setColor}
              colors={textColors}
              title="Text Color"
            />
            <ColorPicker
              onColorSelect={setHighlight}
              colors={highlightColors}
              title="Highlight"
            />
          </div>

          {/* Link */}
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-2">
            <ToolbarButton
              onClick={addLink}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[300px] relative">
        <EditorContent 
          editor={editor}
          className="h-full"
        />
        
        {/* Keyboard Shortcuts Hint */}
        {editor.isEmpty && (
          <div className="absolute top-16 left-4 text-xs text-gray-400 pointer-events-none">
            <p>💡 <strong>Keyboard shortcuts:</strong></p>
            <p>Ctrl+B = Bold • Ctrl+I = Italic • Ctrl+K = Link</p>
            <p>Tab = Indent list • Shift+Tab = Outdent list</p>
            <p>Type "/" for quick commands • "[]" for task list</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor; 