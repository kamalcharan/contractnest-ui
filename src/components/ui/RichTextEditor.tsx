// src/components/ui/RichTextEditor.tsx
// FIXED VERSION - Resolves duplicate extension warnings and JSX attribute issues

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  AlertTriangle, 
  Maximize2, 
  Minimize2, 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, // ✅ Renamed to avoid conflict
  List,
  ListOrdered,
  Table as TableIcon, // ✅ Renamed to avoid conflict
  Quote,
  Link,
  Code,
  Type,
  Palette
} from 'lucide-react';

// TipTap imports
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { CharacterCount } from '@tiptap/extension-character-count';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  minHeight?: number;
  maxHeight?: number;
  maxLength?: number;
  showCharCount?: boolean;
  allowFullscreen?: boolean;
  toolbarButtons?: string[];
  trackingContext?: string;
  trackingMetadata?: Record<string, any>;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  style?: React.CSSProperties;
  outputFormat?: 'html' | 'markdown';
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Enter text...',
  required = false,
  error,
  disabled = false,
  minHeight = 120,
  maxHeight = 400,
  maxLength,
  showCharCount = false,
  allowFullscreen = false,
  toolbarButtons = ['bold', 'italic', 'underline', 'bulletList', 'orderedList', 'table'],
  trackingContext,
  trackingMetadata,
  onFocus,
  onBlur,
  className = '',
  style = {},
  outputFormat = 'html'
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ✅ FIXED: TipTap Editor Configuration - Remove duplicate underline
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        // ✅ FIX: Disable underline in StarterKit to avoid duplicate
        underline: false
      }),
      // ✅ Now add underline as separate extension
      Underline,
      TextStyle,
      Color,
      CharacterCount,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'my-table'
        }
      }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      let outputContent = html;
      
      // Convert to markdown if needed
      if (outputFormat === 'markdown') {
        outputContent = htmlToMarkdown(html);
      }
      
      onChange(outputContent);
    },
    onFocus: () => {
      setIsFocused(true);
      onFocus?.();
    },
    onBlur: () => {
      setIsFocused(false);
      onBlur?.();
    }
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // ✅ Toolbar Actions
  const toolbarActions = [
    {
      key: 'bold',
      icon: Bold,
      title: 'Bold (Ctrl+B)',
      isActive: () => editor?.isActive('bold'),
      action: () => editor?.chain().focus().toggleBold().run()
    },
    {
      key: 'italic',
      icon: Italic,
      title: 'Italic (Ctrl+I)',
      isActive: () => editor?.isActive('italic'),
      action: () => editor?.chain().focus().toggleItalic().run()
    },
    {
      key: 'underline',
      icon: UnderlineIcon,
      title: 'Underline (Ctrl+U)',
      isActive: () => editor?.isActive('underline'),
      action: () => editor?.chain().focus().toggleUnderline().run()
    },
    {
      key: 'divider',
      icon: null,
      title: '',
      isActive: () => false,
      action: () => {}
    },
    {
      key: 'bulletList',
      icon: List,
      title: 'Bullet List',
      isActive: () => editor?.isActive('bulletList'),
      action: () => editor?.chain().focus().toggleBulletList().run()
    },
    {
      key: 'orderedList',
      icon: ListOrdered,
      title: 'Numbered List',
      isActive: () => editor?.isActive('orderedList'),
      action: () => editor?.chain().focus().toggleOrderedList().run()
    },
    {
      key: 'divider',
      icon: null,
      title: '',
      isActive: () => false,
      action: () => {}
    },
    {
      key: 'table',
      icon: TableIcon,
      title: 'Insert Table',
      isActive: () => editor?.isActive('table'),
      action: () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    },
    {
      key: 'quote',
      icon: Quote,
      title: 'Quote',
      isActive: () => editor?.isActive('blockquote'),
      action: () => editor?.chain().focus().toggleBlockquote().run()
    },
    {
      key: 'link',
      icon: Link,
      title: 'Add Link',
      isActive: () => editor?.isActive('link'),
      action: () => {
        const url = window.prompt('Enter URL:');
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      }
    },
    {
      key: 'code',
      icon: Code,
      title: 'Code',
      isActive: () => editor?.isActive('code'),
      action: () => editor?.chain().focus().toggleCode().run()
    }
  ];

  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorOptions = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', 
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#808080'
  ];

  // ✅ Simple HTML to Markdown conversion
  const htmlToMarkdown = (html: string): string => {
    return html
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/<ul><li>(.*?)<\/li><\/ul>/g, '- $1')
      .replace(/<ol><li>(.*?)<\/li><\/ol>/g, '1. $1')
      .replace(/<li>(.*?)<\/li>/g, '- $1')
      .replace(/<blockquote><p>(.*?)<\/p><\/blockquote>/g, '> $1')
      .replace(/<h1>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1')
      .replace(/<p>(.*?)<\/p>/g, '$1\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '')
      .trim();
  };

  // Get character count
  const getCharCount = (): number => {
    return editor?.storage.characterCount?.characters() || 0;
  };

  const charCount = getCharCount();
  const isOverLimit = maxLength && charCount > maxLength;

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Container styles for fullscreen
  const containerStyles: React.CSSProperties = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: colors.utility.primaryBackground,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column'
  } : {};

  const editorStyles: React.CSSProperties = {
    minHeight: `${minHeight}px`,
    maxHeight: isFullscreen ? 'calc(100vh - 200px)' : `${maxHeight}px`,
    overflow: 'auto',
    ...style
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div 
      className={`rich-text-editor ${className}`}
      style={containerStyles}
    >
      {/* Label */}
      {label && (
        <label 
          className="block text-sm font-medium mb-2 transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {label}
          {required && <span style={{ color: colors.semantic.error }}>*</span>}
        </label>
      )}

      {/* Editor Container */}
      <div 
        className="relative"
        style={{
          direction: 'ltr',
          textAlign: 'left'
        }}
      >
        {/* Fullscreen header */}
        {isFullscreen && (
          <div 
            className="flex items-center justify-between p-3 border-b mb-4"
            style={{ borderColor: colors.utility.secondaryText + '20' }}
          >
            <span 
              className="text-lg font-semibold"
              style={{ color: colors.utility.primaryText }}
            >
              {label || 'Rich Text Editor'}
            </span>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-md hover:opacity-80 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                color: colors.utility.primaryText
              }}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Editor with Toolbar */}
        <div 
          className={`tiptap-editor-wrapper ${error ? 'error' : ''} ${isFocused ? 'focused' : ''}`}
          style={{
            border: `1px solid ${error 
              ? colors.semantic.error
              : isFocused 
                ? colors.brand.primary
                : colors.utility.secondaryText + '40'}`,
            borderRadius: '8px',
            backgroundColor: colors.utility.primaryBackground,
            overflow: 'hidden'
          }}
        >
          {/* Toolbar */}
          {toolbarButtons.length > 0 && (
            <div 
              className="flex items-center gap-1 p-3 border-b bg-gray-50 dark:bg-gray-800"
              style={{ borderColor: colors.utility.secondaryText + '20' }}
            >
              {toolbarActions
                .filter(action => toolbarButtons.includes(action.key) || action.key === 'divider')
                .map((action, index) => {
                  if (action.key === 'divider') {
                    return (
                      <div 
                        key={`divider-${index}`}
                        className="w-px h-6 mx-1"
                        style={{ backgroundColor: colors.utility.secondaryText + '30' }}
                      />
                    );
                  }

                  const IconComponent = action.icon!;
                  const isActive = action.isActive();

                  return (
                    <button
                      key={action.key}
                      type="button"
                      onClick={action.action}
                      disabled={disabled}
                      className={`
                        p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 
                        transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                        ${isActive ? 'bg-gray-300 dark:bg-gray-600' : ''}
                      `}
                      style={{
                        color: isActive ? colors.brand.primary : colors.utility.primaryText,
                        backgroundColor: isActive ? `${colors.brand.primary}20` : 'transparent'
                      }}
                      title={action.title}
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  );
                })}

              {/* Color picker */}
              {toolbarButtons.includes('color') && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    disabled={disabled}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    style={{ color: colors.utility.primaryText }}
                    title="Text Color"
                  >
                    <Palette className="w-4 h-4" />
                  </button>
                  
                  {showColorPicker && (
                    <div 
                      className="absolute top-full left-0 mt-1 p-2 border rounded-lg shadow-lg z-10 grid grid-cols-5 gap-1"
                      style={{
                        backgroundColor: colors.utility.secondaryBackground,
                        borderColor: colors.utility.secondaryText + '20'
                      }}
                    >
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fullscreen toggle */}
              {allowFullscreen && !isFullscreen && (
                <>
                  <div 
                    className="w-px h-6 mx-1"
                    style={{ backgroundColor: colors.utility.secondaryText + '30' }}
                  />
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    disabled={disabled}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    style={{ color: colors.utility.primaryText }}
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}

          {/* Editor Content */}
          <div style={editorStyles}>
            <EditorContent 
              editor={editor}
              className="tiptap-content"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2">
            <AlertTriangle 
              className="w-4 h-4 flex-shrink-0"
              style={{ color: colors.semantic.error }}
            />
            <span 
              className="text-sm transition-colors"
              style={{ color: colors.semantic.error }}
            >
              {error}
            </span>
          </div>
        )}

        {/* Character Count and Info */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Format indicator */}
          <div 
            className="text-xs transition-colors hidden sm:block"
            style={{ color: colors.utility.secondaryText }}
          >
            Format: {outputFormat.toUpperCase()}
          </div>

          {/* Character Count */}
          {showCharCount && (
            <div className="flex items-center gap-2">
              {maxLength && (
                <span 
                  className={`text-xs transition-colors ${isOverLimit ? 'font-medium' : ''}`}
                  style={{ 
                    color: isOverLimit 
                      ? colors.semantic.error 
                      : colors.utility.secondaryText 
                  }}
                >
                  {charCount.toLocaleString()}/{maxLength.toLocaleString()}
                </span>
              )}
              
              {!maxLength && (
                <span 
                  className="text-xs transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {charCount.toLocaleString()} characters
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Overlay Backdrop */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-9998"
          onClick={toggleFullscreen}
        />
      )}

      {/* ✅ FIXED: Custom CSS for TipTap styling with proper JSX syntax */}
      <style jsx="true">{`
        .tiptap-content .ProseMirror {
          padding: 12px;
          outline: none;
          color: ${colors.utility.primaryText};
          background-color: ${colors.utility.primaryBackground};
          min-height: ${minHeight - 60}px;
          white-space: pre-wrap;
        }
        
        .tiptap-content .ProseMirror p.is-editor-empty:first-child::before {
          content: "${placeholder}";
          float: left;
          color: ${colors.utility.secondaryText};
          pointer-events: none;
          height: 0;
        }
        
        .tiptap-content .ProseMirror strong {
          font-weight: bold;
        }
        
        .tiptap-content .ProseMirror em {
          font-style: italic;
        }
        
        .tiptap-content .ProseMirror u {
          text-decoration: underline;
        }
        
        .tiptap-content .ProseMirror ul, 
        .tiptap-content .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        
        .tiptap-content .ProseMirror li {
          margin: 0.25rem 0;
        }
        
        .tiptap-content .ProseMirror blockquote {
          border-left: 4px solid ${colors.utility.secondaryText};
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        
        .tiptap-content .ProseMirror code {
          background-color: ${colors.utility.secondaryText}20;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
        }
        
        .tiptap-content .ProseMirror table {
          border-collapse: collapse;
          margin: 1rem 0;
          width: 100%;
        }
        
        .tiptap-content .ProseMirror td,
        .tiptap-content .ProseMirror th {
          border: 1px solid ${colors.utility.secondaryText}40;
          padding: 0.5rem;
          vertical-align: top;
        }
        
        .tiptap-content .ProseMirror th {
          background-color: ${colors.utility.secondaryText}10;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;