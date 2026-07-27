import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import DOMPurify from 'dompurify'
import { useLocale } from '../../locales'
import { useRouter } from '../../utils/router'
import { getPostBySlug } from '../../modules/posts/api'
import type { Post } from '../../modules/posts/api'
import Header from '../../components/header'
import PostSidebar from '../../components/post-sidebar'
import Spinner from '../../components/spinner'
import Footer from '../../components/footer'
import NotFound from '../../pages/not-found'
import Breadcrumb from '../../components/breadcrumb'
import DisqusComments from '../../components/disqus-comments'
import { ENV } from '../../constants/env'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import go from 'highlight.js/lib/languages/go'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import sql from 'highlight.js/lib/languages/sql'
import yaml from 'highlight.js/lib/languages/yaml'
import markdown from 'highlight.js/lib/languages/markdown'
import rust from 'highlight.js/lib/languages/rust'
import java from 'highlight.js/lib/languages/java'
import csharp from 'highlight.js/lib/languages/csharp'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('go', go)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('java', java)
hljs.registerLanguage('csharp', csharp)
import 'highlight.js/styles/atom-one-dark-reasonable.css'
interface Props {
  navigate: (path: string) => void
  slug: string
}

function PostDetail({ navigate, slug }: Props) {
  const { t } = useLocale()
  const { prefetch } = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [lightbox, setLightbox] = useState('')

  useEffect(() => {
    setFetching(true)
    setError('')
    setPost(null)
    getPostBySlug(slug)
      .then((p) => {
        setPost(p)
        document.title = p.title + ' | Eriscoo'
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Post not found'))
      .finally(() => setFetching(false))
    return () => { document.title = 'Eriscoo' }
  }, [slug])

  const bodyRef = useRef<HTMLDivElement>(null)
  const handleBodyClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG' && target.closest('.prose')) {
      setLightbox((target as HTMLImageElement).src)
    }
  }, [])

  function formatDateTime(dateStr: string | null) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }) + ' ' +
      d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
  }

  const copyBtnSvg = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'

  const processedBody = useMemo(() => {
    if (!post?.body) return ''
    const cleanBody = DOMPurify.sanitize(post.body)
    const parser = new DOMParser()
    const dom = parser.parseFromString(cleanBody, 'text/html')
    dom.body.querySelectorAll('pre').forEach((el) => {
      el.querySelectorAll('br').forEach(br => br.replaceWith('\n'))
      const code = el.textContent?.trim() || ''
      if (!code) return
      const manualLang = el.getAttribute('data-language')
      const validLang = manualLang && hljs.getLanguage(manualLang) ? manualLang : null
      const result = validLang
        ? hljs.highlight(code, { language: validLang, ignoreIllegals: true })
        : hljs.highlightAuto(code)
      const langLabel = manualLang || result.language || 'text'
      const highlighted = '<pre class="code-block-pre"><code class="hljs' + (result.language ? ' language-' + result.language : '') + '">' + result.value + '</code></pre>'
      const btn = '<button class="copy-btn" title="Copy code" data-code="' + code.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '">' + copyBtnSvg + '</button>'
      const headerHtml = '<div class="code-block-header"><span class="code-block-lang">' + langLabel + '</span>' + btn + '</div>'
      el.outerHTML = '<div class="editor-code-block">' + headerHtml + highlighted + '</div>'
    })

    function walkInlineCode(node: Node) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement
        if (el.tagName === 'PRE' || el.tagName === 'CODE') return
        Array.from(el.childNodes).forEach(walkInlineCode)
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || ''
        const regex = /`([^`]+)`/g
        let match: RegExpExecArray | null
        const parts: (string | Element)[] = []
        let lastIndex = 0
        let found = false
        while ((match = regex.exec(text)) !== null) {
          found = true
          if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index))
          }
          const code = document.createElement('code')
          code.textContent = match[1]
          parts.push(code)
          lastIndex = regex.lastIndex
        }
        if (!found) return
        if (lastIndex < text.length) {
          parts.push(text.slice(lastIndex))
        }
        const fragment = document.createDocumentFragment()
        parts.forEach(part => {
          if (typeof part === 'string') {
            fragment.appendChild(document.createTextNode(part))
          } else {
            fragment.appendChild(part)
          }
        })
        node.parentNode!.replaceChild(fragment, node)
      }
    }
    walkInlineCode(dom.body)

    return dom.body.innerHTML
  }, [post?.body])

  useEffect(() => {
    if (!bodyRef.current) return
    const el = bodyRef.current
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const btn = target.closest('.copy-btn') as HTMLElement | null
      if (!btn) return
      const code = btn.getAttribute('data-code') || ''
      if (!code) return
      navigator.clipboard.writeText(code).then(() => {
        btn.innerHTML = '<span class="text-xs">Copied!</span>'
        setTimeout(() => {
          btn.innerHTML = copyBtnSvg
        }, 2000)
      })
    }
    el.addEventListener('click', handleClick)
    return () => el.removeEventListener('click', handleClick)
  }, [processedBody, bodyRef])

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="default" navigate={navigate} />
        <main className="flex-1 flex items-center justify-center">
          <Spinner className="w-8 h-8 text-purple-400" />
        </main>
      </div>
    )
  }

  if (error || !post) {
    return <NotFound navigate={navigate} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
        <main className="flex-1 min-w-0">
        {/* Breadcrumb */}
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: post.title }]}
          navigate={navigate}
          className="mb-6"
        />

        {/* Title */}
        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-6">
          {post.title}
        </h1>

        {/* Meta: Author + Date + Categories */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5 flex-wrap">
          <div className="flex items-center gap-3">
            {post.author_avatar_url ? (
              <img src={`${ENV.API_URL}${post.author_avatar_url}`} alt={post.created_by_name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0" loading="lazy" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                {post.created_by_name ? post.created_by_name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex flex-col gap-12px">
              <p className="text-sm text-zinc-200 font-medium">{post.created_by_name}</p>
              <p className="text-xs text-zinc-500">{t.post.postedOn} {formatDateTime(post.created_at)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {post.category_names && post.category_slugs && (() => {
              const names = post.category_names.split(', ').filter(Boolean)
              const slugs = post.category_slugs.split(', ').filter(Boolean)
              return names.map((cat, i) => (
                <span key={cat}
                  className="text-xs px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-600/30 hover:bg-purple-600/30 hover:text-purple-200 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate(`/posts/categories/${encodeURIComponent(slugs[i] || cat)}`) }}
                  onMouseEnter={() => prefetch('/posts/categories')}
                >
                  {cat}
                </span>
              ))
            })()}
          </div>
        </div>

        {post.image_url && (
          <div className="w-full aspect-video rounded-lg overflow-hidden mb-8 cursor-pointer" onClick={() => setLightbox(`${ENV.API_URL}${post.image_url}`)}>
            <img src={`${ENV.API_URL}${post.image_url}`} alt={post.title}
              className="w-full h-full object-cover hover:opacity-90 transition-opacity" fetchPriority="high" loading="eager" />
          </div>
        )}

        {/* Body */}
        {post.body ? (
          <div ref={bodyRef} onClick={handleBodyClick}
            className="post-body prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed [&_img]:w-full [&_img]:rounded-lg [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity [&_a]:text-purple-500 [&_a]:hover:text-purple-300 [&_a]:transition-colors [&_p]:mb-0 [&_h3]:mt-5 [&_h4]:mt-4 [&_li]:pl-2"
            dangerouslySetInnerHTML={{ __html: processedBody }}
          />
        ) : (
          <p className="text-zinc-500 italic">No content</p>
        )}

        {/* Tags */}
        {post.tag_names && post.tag_slugs && post.tag_names.split(', ').filter(Boolean).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-8">
            <span className="text-xs text-zinc-400 font-medium">Tag:</span>
            {(() => {
              const names = post.tag_names.split(', ').filter(Boolean)
              const slugs = post.tag_slugs.split(', ').filter(Boolean)
              return names.map((tag, i) => (
                <span key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/5 hover:bg-zinc-700 hover:text-zinc-100 transition-colors cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigate(`/posts/tags/${encodeURIComponent(slugs[i] || tag)}`) }}
                  onMouseEnter={() => prefetch('/posts/tags')}
                >
                  #{tag}
                </span>
              ))
            })()}
          </div>
        )}

        <hr className="border-white/5 my-8" />
        <DisqusComments identifier={slug} />
      </main>
          <PostSidebar navigate={navigate} />
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightbox('')}>
          <button onClick={() => setLightbox('')}
            className="lightbox-close absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 text-lg">
            &times;
          </button>
          <img src={lightbox} alt="" className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Footer */}
      <Footer navigate={navigate} />
    </div>
  )
}

export default PostDetail
