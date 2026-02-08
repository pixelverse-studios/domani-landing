'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Smartphone,
  Monitor,
  Variable,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface EmailComposerProps {
  content?: string
  onChange?: (html: string, text: string) => void
  placeholder?: string
  className?: string
  variables?: string[]
}

export function EmailComposer({
  content = '',
  onChange,
  className,
  variables = [],
}: EmailComposerProps) {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showPreview, setShowPreview] = useState(false)
  const [showVariables, setShowVariables] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML()
        const text = editor.getText()
        onChange(html, text)
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  })

  if (!editor) {
    return null
  }

  const insertVariable = (variable: string) => {
    editor.chain().focus().insertContent(`{{${variable}}}`).run()
    setShowVariables(false)
  }

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        'p-2 rounded hover:bg-gray-100 transition-colors',
        isActive && 'bg-gray-100 text-primary'
      )}
    >
      {children}
    </button>
  )

  const ToolbarDivider = () => (
    <div className="w-px h-6 bg-gray-200" />
  )

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Text formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive('code')}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Variables */}
          {variables.length > 0 && (
            <div className="relative">
              <ToolbarButton
                onClick={() => setShowVariables(!showVariables)}
                title="Insert Variable"
              >
                <Variable className="h-4 w-4" />
              </ToolbarButton>

              {showVariables && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[150px]">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                      Insert Variable
                    </div>
                    {variables.map((variable) => (
                      <button
                        key={variable}
                        onClick={() => insertVariable(variable)}
                        className="block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-100"
                      >
                        {`{{${variable}}}`}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Toggle */}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors',
                showPreview
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              <Eye className="h-4 w-4" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="flex">
        {/* Editor */}
        <div className={cn('flex-1', showPreview && 'border-r border-gray-200')}>
          <EditorContent editor={editor} />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="flex-1">
            {/* Preview Mode Selector */}
            <div className="border-b border-gray-200 p-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded text-sm',
                    previewMode === 'desktop'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  <Monitor className="h-4 w-4" />
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded text-sm',
                    previewMode === 'mobile'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-4 bg-gray-50 min-h-[400px]">
              <div
                className={cn(
                  'bg-white rounded-lg shadow-sm mx-auto',
                  previewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'
                )}
              >
                <div className="p-6">
                  {/* Preview with rendered variables */}
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: editor.getHTML().replace(
                        /\{\{(\w+)\}\}/g,
                        '<span class="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-mono">{{$1}}</span>'
                      ),
                    }}
                  />
                </div>

                {/* Email Footer Preview */}
                <div className="border-t border-gray-200 p-6 text-center text-sm text-gray-500">
                  <p>© 2025 Your Company. All rights reserved.</p>
                  <p className="mt-2">
                    <a href="#" className="text-primary hover:underline">Unsubscribe</a>
                    {' · '}
                    <a href="#" className="text-primary hover:underline">View in browser</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}