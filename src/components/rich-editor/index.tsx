import { useEffect, useRef, useState, useCallback } from 'react'
import { ENV } from '../../constants/env'
import {
  createEditorSystem,
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  listExtension,
  historyExtension,
  blockFormatExtension,
  imageExtension,
  horizontalRuleExtension,
  linkExtension,
  codeExtension,
} from '@lexkit/editor'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html'
import { $getRoot, $getSelection, $isRangeSelection, $isTextNode, $createLineBreakNode, KEY_ENTER_COMMAND, COMMAND_PRIORITY_CRITICAL } from 'lexical'
import { $isLinkNode, $toggleLink } from '@lexical/link'
import { registerCodeHighlighting } from '@lexical/code'

const extensions = [
  boldExtension,
  italicExtension,
  underlineExtension,
  strikethroughExtension,
  listExtension,
  historyExtension,
  blockFormatExtension,
  imageExtension,
  horizontalRuleExtension,
  linkExtension,
  codeExtension,
] as const

const { Provider, useEditor } = createEditorSystem<typeof extensions>()

interface Props {
  value: string
  onChange: (html: string) => void
}

function EditorInner({ value, onChange }: Props) {
  const { commands, activeStates, lexical: editor } = useEditor()
  const [linkActive, setLinkActive] = useState(false)
  const [fmtBold, setFmtBold] = useState(false)
  const [fmtItalic, setFmtItalic] = useState(false)
  const [fmtUnderline, setFmtUnderline] = useState(false)
  const [fmtStrikethrough, setFmtStrikethrough] = useState(false)
  const [isUl, setIsUl] = useState(false)
  const [isOl, setIsOl] = useState(false)
  const [isQuote, setIsQuote] = useState(false)
  const [mode, setMode] = useState<'visual' | 'html'>('visual')
  const [htmlContent, setHtmlContent] = useState('')
  const htmlRef = useRef<HTMLTextAreaElement>(null)
  const initialDone = useRef(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleImagePick = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !commands) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch(`${ENV.API_URL}/api/v1/upload?dir=post`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` },
        body: fd,
      })
      if (!res.ok) return
      const data = await res.json()
      ;(commands as any).insertImage?.({ src: `${ENV.API_URL}${data.url}` })
    } catch {}
    if (fileRef.current) fileRef.current.value = ''
  }, [commands])

  useEffect(() => {
    if (!editor || initialDone.current) return
    initialDone.current = true
    if (value) {
      try {
        editor.update(() => {
          const parser = new DOMParser()
          const dom = parser.parseFromString(value, 'text/html')
          const nodes = $generateNodesFromDOM(editor, dom.body)
          if (nodes.length > 0) {
            const root = $getRoot()
            root.clear()
            root.append(...nodes)
          }
        })
      } catch {}
    }
  }, [editor, value])

  useEffect(() => {
    if (!editor || !commands) return
    try {
      const unregister = editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
        try {
          if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return
          editorState.read(() => {
            const html = ($generateHtmlFromNodes as any)(editor)
            onChange(html)
          })
        } catch {}
      })
      return () => unregister()
    } catch {}
  }, [editor, commands, onChange])

  function updateFormatStates() {
    if (!editor) return
    editor.getEditorState().read(() => {
      const sel = $getSelection()
      if ($isRangeSelection(sel)) {
        const node = sel.anchor.getNode()
        const linkNode = $isLinkNode(node) || $isLinkNode(node.getParent())
        setLinkActive(!!linkNode)
        let fmt = 0
        sel.getNodes().forEach((n) => {
          if ($isTextNode(n)) fmt |= n.getFormat()
        })
        setFmtBold(!!(fmt & 1))
        setFmtItalic(!!(fmt & 2))
        setFmtStrikethrough(!!(fmt & 4))
        setFmtUnderline(!!(fmt & 8))
        // Check block types
        let ul = false, ol = false, quote = false
        let current = node
        while (current) {
          const type = current.getType()
          if (type === 'ul' || type === 'list') { ul = true; break }
          if (type === 'ol') { ol = true; break }
          if (type === 'quote') { quote = true; break }
          if (type === 'root') break
          current = current.getParent()!
        }
        setIsUl(ul)
        setIsOl(ol)
        setIsQuote(quote)
      }
    })
  }

  useEffect(() => {
    if (!editor) return
    try {
      registerCodeHighlighting(editor)
    } catch {}
  }, [editor])

  useEffect(() => {
    if (!editor) return
    try {
      const unregister = editor.registerUpdateListener(() => {
        try {
          updateFormatStates()
        } catch {}
      })
      return () => unregister()
    } catch {}
  }, [editor])

  useEffect(() => {
    if (!editor) return
    return editor.registerCommand(KEY_ENTER_COMMAND, (event: KeyboardEvent | null) => {
      if (event?.shiftKey) {
        event.preventDefault()
        editor.update(() => {
          const sel = $getSelection()
          if ($isRangeSelection(sel)) {
            sel.insertNodes([($createLineBreakNode as any)()])
          }
        })
        return true
      }
      return false
    }, COMMAND_PRIORITY_CRITICAL)
  }, [editor])

  const ic = (d: string) => <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

  function switchToHtml() {
    if (!editor) return
    editor.getEditorState().read(() => {
      const html = ($generateHtmlFromNodes as any)(editor)
      setHtmlContent(html)
      setMode('html')
    })
  }

  function switchToVisual() {
    if (!editor) return
    editor.update(() => {
      try {
        const parser = new DOMParser()
        const dom = parser.parseFromString(htmlContent, 'text/html')
        const nodes = $generateNodesFromDOM(editor, dom.body)
        if (nodes.length > 0) {
          const root = $getRoot()
          root.clear()
          root.append(...nodes)
        }
      } catch {}
    })
    setMode('visual')
  }

  function handleHtmlChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setHtmlContent(e.target.value)
  }

  function tb(label: string, icon: React.ReactNode, active: boolean, onClick: () => void) {
    return (
      <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick() }}
        className={`flex items-center justify-center w-7 h-7 rounded cursor-pointer transition-colors ${
          active ? 'bg-purple-600/30 text-purple-200' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[.04]'
        }`} title={label}>
        {icon}
      </button>
    )
  }

  function sep() {
    return <span className="w-px h-5 bg-white/10 mx-0.5 flex-shrink-0" />
  }

  if (!editor) return null

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden editor-root">
      <style>{`
.editor-root a { color: #bb86fc !important; text-decoration: underline !important; text-underline-offset: 2px !important; }
.editor-root a:hover { color: #d4b8ff !important; }
.editor-root u, .editor-root .underline { text-decoration: underline !important; }
.editor-root s, .editor-root .line-through, .editor-root .strikethrough { text-decoration: line-through !important; }
.editor-root ul { list-style-type: disc !important; padding-left: 1.5rem !important; }
.editor-root ol { list-style-type: decimal !important; padding-left: 1.5rem !important; }
.editor-root blockquote { border-left: 2px solid #bb86fc !important; padding-left: 1rem !important; margin: 0.5rem 0 !important; font-style: italic !important; color: #a1a1aa !important; }
.editor-root .editor-code-block { padding: 1rem 1.5rem; margin: 1.5rem 0; border: 1px solid #3f3f46; border-radius: 0.75rem; background: #27272a; font-family: ui-monospace, monospace; font-size: 0.875rem; line-height: 1.7; overflow-x: auto; display: block; color: #e4e4e7; }
html.light .editor-root .editor-code-block { background: #f1f3f5; border-color: #dee2e6; color: #1a1a2e; }
.editor-root .token.comment { color: #6c7986 !important; font-style: italic !important; }
.editor-root .token.keyword, .editor-root .token.control { color: #c678dd !important; }
.editor-root .token.string, .editor-root .token.char { color: #98c379 !important; }
.editor-root .token.function { color: #61afef !important; }
.editor-root .token.number { color: #d19a66 !important; }
.editor-root .token.boolean { color: #e06c75 !important; }
.editor-root .token.operator { color: #56b6c2 !important; }
.editor-root .token.variable { color: #e5c07b !important; }
.editor-root .token.tag { color: #e06c75 !important; }
.editor-root .token.attr-name { color: #d19a66 !important; }
.editor-root .token.attr-value { color: #98c379 !important; }
.editor-root .token.property { color: #61afef !important; }
.editor-root .token.punctuation { color: #abb2bf !important; }
`}</style>
      <div className="flex flex-wrap items-center gap-px px-2 py-1.5 border-b border-white/10 bg-white/[.02] select-none">
        {tb('Bold', <b className="text-sm font-bold">B</b>, fmtBold, () => commands.toggleBold())}
        {tb('Italic', <i className="text-sm font-serif">I</i>, fmtItalic, () => commands.toggleItalic())}
        {tb('Underline', <u className="text-sm">U</u>, fmtUnderline, () => commands.toggleUnderline())}
        {tb('Strikethrough', <s className="text-sm">S</s>, fmtStrikethrough, () => commands.toggleStrikethrough())}
        {sep()}
        {tb('Heading 2', <span className="text-xs font-bold">H2</span>, activeStates.isH2, () => commands.toggleHeading('h2'))}
        {tb('Heading 3', <span className="text-xs font-bold">H3</span>, activeStates.isH3, () => commands.toggleHeading('h3'))}
        {tb('Heading 4', <span className="text-xs font-bold">H4</span>, activeStates.isH4, () => commands.toggleHeading('h4'))}
        {sep()}
        {tb('Bullet List', ic('M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'), isUl, () => commands.toggleUnorderedList())}
        {tb('Numbered List', ic('M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'), isOl, () => commands.toggleOrderedList())}
        {sep()}
        {tb('Quote', ic('M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z'), isQuote, () => commands.toggleQuote())}
        {tb('Code Block', ic('M16 18l6-6-6-6M8 6l-6 6 6 6'), activeStates.isInCodeBlock, () => commands.toggleCodeBlock())}
        {tb('Horizontal Rule', ic('M3 12h18'), false, () => commands.insertHorizontalRule())}
        {tb('Image', ic('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'), false, () => fileRef.current?.click())}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
        {tb('Link', ic('M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'), linkActive, () => {
          if (linkActive) {
            editor.update(() => {
              const sel = $getSelection()
              if ($isRangeSelection(sel)) {
                $toggleLink(null)
              }
            })
          } else {
            const url = prompt('Enter link URL:', 'https://')
            if (url) {
              editor.update(() => {
                const sel = $getSelection()
                if ($isRangeSelection(sel)) {
                  $toggleLink(url)
                }
              })
            }
          }
        })}
        {sep()}
        {tb('Undo', ic('M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'), false, () => commands.undo())}
        {tb('Redo', ic('M21 7v6h-6M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13'), false, () => commands.redo())}
        {sep()}
        {tb('HTML', <code className="text-xs font-mono font-bold">{'< >'}</code>, mode === 'html', () => {
          if (mode === 'html') switchToVisual()
          else switchToHtml()
        })}
      </div>
      {mode === 'html' ? (
        <textarea ref={htmlRef} value={htmlContent} onChange={handleHtmlChange}
          className="w-full min-h-[300px] p-4 bg-zinc-900 text-zinc-100 font-mono text-sm outline-none border-0 resize-none"
          spellCheck={false} />
      ) : (
        <div className="text-zinc-100 relative" style={{ minHeight: 300 }}>
          <RichTextPlugin
            contentEditable={
              <div className="relative">
                <ContentEditable className="p-4 outline-none min-h-[300px]" />
              </div>
            }
            placeholder={<div className="p-4 text-zinc-600 pointer-events-none absolute inset-0">Start writing...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      )}
    </div>
  )
}

function RichEditor({ value, onChange }: Props) {
  return (
    <Provider extensions={extensions} config={{ theme: {
      link: 'text-purple-400 underline underline-offset-2 cursor-pointer',
      paragraph: 'mb-3',
      heading: { h1: 'text-2xl font-bold mb-3 mt-4', h2: 'text-xl font-bold mb-2 mt-3', h3: 'text-lg font-semibold mb-2 mt-2', h4: 'text-base font-semibold mb-1 mt-2' },
      text: { underline: 'underline underline-offset-2', strikethrough: 'line-through', italic: 'italic', bold: 'font-bold' },
      list: { ul: 'list-disc ml-6 mb-2', ol: 'list-decimal ml-6 mb-2', listitem: 'mb-1' },
      quote: 'border-l-2 border-purple-500/50 pl-4 ml-2 my-3 italic text-zinc-300',
      code: 'editor-code-block',
    } }}>
      <EditorInner value={value} onChange={onChange} />
    </Provider>
  )
}

export default RichEditor
