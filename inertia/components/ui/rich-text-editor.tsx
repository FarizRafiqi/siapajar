import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  X as CloseIcon,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: string
}

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: Readonly<{
  active?: boolean
  disabled?: boolean
  label: string
  onClick: () => void
  children: React.ReactNode
}>) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer rounded p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
  minHeight = '8rem',
}: RichTextEditorProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const linkInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: value || '<p></p>',
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    editorProps: {
      attributes: {
        'class':
          'rich-text-content prose prose-sm max-w-none min-h-[inherit] px-3 py-2 outline-none dark:prose-invert',
        'data-placeholder': placeholder ?? '',
      },
    },
  })

  useEffect(() => {
    if (!editor || editor.getHTML() === value) return
    editor.commands.setContent(value || '<p></p>', { emitUpdate: false })
  }, [editor, value])

  useEffect(() => {
    if (!linkDialogOpen) return
    linkInputRef.current?.focus()
    linkInputRef.current?.select()
  }, [linkDialogOpen])

  if (!editor)
    return (
      <div className="rounded-lg border border-neutral-300 bg-neutral-50 p-3 text-sm text-neutral-500">
        Memuat editor...
      </div>
    )

  const openLinkDialog = () => {
    const current = editor.getAttributes('link').href as string | undefined
    setLinkUrl(current ?? 'https://')
    setLinkDialogOpen(true)
  }

  const applyLink = () => {
    const url = linkUrl.trim()
    if (!url) editor.chain().focus().unsetLink().run()
    else editor.chain().focus().setLink({ href: url }).run()
    setLinkDialogOpen(false)
  }

  return (
    <>
      <div
        className={`overflow-hidden rounded-lg border border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800 ${disabled ? 'opacity-70' : ''}`}
      >
        {!disabled && (
          <div className="flex flex-wrap items-center gap-1 border-b border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-700 dark:bg-neutral-900">
            <ToolbarButton
              label="Bold"
              active={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              active={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Underline"
              active={editor.isActive('underline')}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Strikethrough"
              active={editor.isActive('strike')}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <Strikethrough className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Bullet list"
              active={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Numbered list"
              active={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton label="Link" active={editor.isActive('link')} onClick={openLinkDialog}>
              <LinkIcon className="h-4 w-4" />
            </ToolbarButton>
            <span className="mx-1 h-5 w-px bg-neutral-200 dark:bg-neutral-700" />
            <select
              aria-label="Alignment"
              value={
                editor.isActive({ textAlign: 'center' })
                  ? 'center'
                  : editor.isActive({ textAlign: 'right' })
                    ? 'right'
                    : editor.isActive({ textAlign: 'justify' })
                      ? 'justify'
                      : 'left'
              }
              onChange={(event) =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign(event.target.value as 'left' | 'center' | 'right' | 'justify')
                  .run()
              }
              className="rounded border-0 bg-transparent px-1 py-1 text-xs text-neutral-600 outline-none dark:text-neutral-300"
            >
              <option value="left">Rata kiri</option>
              <option value="center">Tengah</option>
              <option value="right">Rata kanan</option>
              <option value="justify">Justify</option>
            </select>
            <span className="flex-1" />
            <ToolbarButton
              label="Undo"
              disabled={!editor.can().undo()}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Redo"
              disabled={!editor.can().redo()}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
        )}
        <div
          style={{ minHeight }}
          className="[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-neutral-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]"
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {linkDialogOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-950/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLinkDialogOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="rich-text-link-title"
            className="flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[5px_5px_0px_#000000] dark:bg-neutral-900"
            onKeyDown={(event) => {
              if (event.key === 'Escape') setLinkDialogOpen(false)
              if (event.key === 'Enter') {
                event.preventDefault()
                applyLink()
              }
            }}
          >
            <div className="flex shrink-0 items-center justify-between border-b-2 border-black px-4 py-3">
              <h2
                id="rich-text-link-title"
                className="text-sm font-bold text-neutral-900 dark:text-white"
              >
                Tambahkan tautan
              </h2>
              <button
                type="button"
                aria-label="Tutup dialog tautan"
                onClick={() => setLinkDialogOpen(false)}
                className="rounded-lg p-1.5 text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-emerald-500 dark:text-neutral-200 dark:hover:bg-neutral-800"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto p-4">
              <label
                htmlFor="rich-text-link-url"
                className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
              >
                URL tautan
              </label>
              <input
                ref={linkInputRef}
                id="rich-text-link-url"
                type="url"
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https://contoh.id"
                className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white dark:focus:ring-emerald-900"
              />
              <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                Kosongkan URL untuk menghapus tautan dari teks yang dipilih.
              </p>
            </div>
            <div className="flex shrink-0 justify-end gap-2 border-t border-neutral-200 px-4 py-3 dark:border-neutral-700">
              <button
                type="button"
                onClick={() => setLinkDialogOpen(false)}
                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-emerald-500 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="rounded-lg border-2 border-black bg-emerald-400 px-3 py-2 text-sm font-semibold text-neutral-950 shadow-[2px_2px_0px_#000000] hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-500"
              >
                Simpan tautan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
