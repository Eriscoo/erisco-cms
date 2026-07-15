import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useLocale } from '../../locales'
import { getPostBySlug } from '../../modules/posts/api'
import type { Post } from '../../modules/posts/api'
import Header from '../../components/header'
import PostSidebar from '../../components/post-sidebar'
import Spinner from '../../components/spinner'
import Footer from '../../components/footer'
import NotFound from '../../pages/not-found'
import Breadcrumb from '../../components/breadcrumb'
import { ENV } from '../../constants/env'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
interface Props {
  navigate: (path: string) => void
  slug: string
}

function PostDetail({ navigate, slug }: Props) {
  const { t } = useLocale()
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
        document.title = p.title + ' | Erisco Blog'
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Post not found'))
      .finally(() => setFetching(false))
    return () => { document.title = 'Erisco Blog' }
  }, [slug])

  const bodyRef = useRef<HTMLDivElement>(null)
  const handleBodyClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG' && target.closest('.prose')) {
      setLightbox((target as HTMLImageElement).src)
    }
  }, [])

  function formatDate(dateStr: string | null) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }) + ' ' +
      d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
  }

  const copyBtnSvg = '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'

  const processedBody = useMemo(() => {
    if (!post?.body) return ''
    const parser = new DOMParser()
    const dom = parser.parseFromString(post.body, 'text/html')
    dom.body.querySelectorAll('pre').forEach((el) => {
      const withNewlines = el.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
      const code = withNewlines.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').trim()
      if (!code) return
      const result = hljs.highlightAuto(code)
      const manualLang = el.getAttribute('data-language')
      const langLabel = manualLang || result.language || 'text'
      const highlighted = '<pre class="code-block-pre"><code class="hljs' + (result.language ? ' language-' + result.language : '') + '">' + result.value + '</code></pre>'
      const btn = '<button class="copy-btn" title="Copy code" data-code="' + code.replace(/"/g, '&quot;') + '">' + copyBtnSvg + '</button>'
      const headerHtml = '<div class="code-block-header"><span class="code-block-lang">' + langLabel + '</span>' + btn + '</div>'
      el.outerHTML = '<div class="editor-code-block">' + headerHtml + highlighted + '</div>'
    })
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

      {post.image_url && (
        <div className="relative w-full h-64 md:h-96 overflow-hidden">
          <img src={`${ENV.API_URL}${post.image_url}`} alt={post.title}
            className="w-full h-full object-cover" />
        </div>
      )}

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

        {/* Meta: Author + Date + Categories + Tags */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5 flex-wrap">
          <div className="flex items-center gap-3">
            {post.author_avatar_url ? (
              <img src={`${ENV.API_URL}${post.author_avatar_url}`} alt={post.created_by_name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {post.created_by_name ? post.created_by_name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-sm text-zinc-200 font-medium">{post.created_by_name}</p>
              <p className="text-xs text-zinc-500">{formatDate(post.created_at)}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {post.category_names && post.category_names.split(', ').filter(Boolean).map((cat) => (
              <span key={cat}
                className="text-xs px-2.5 py-1 rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30 hover:bg-purple-600/30 hover:text-purple-200 transition-colors cursor-pointer">
                {cat}
              </span>
            ))}
            {post.tag_names && post.tag_names.split(', ').filter(Boolean).map((tag) => (
              <span key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-white/5 hover:bg-zinc-700 hover:text-zinc-100 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Body */}
        {post.body ? (
          <div ref={bodyRef} onClick={handleBodyClick}
            className="post-body prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed [&_img]:w-full [&_img]:rounded-lg [&_img]:cursor-pointer [&_img]:hover:opacity-90 [&_img]:transition-opacity [&_a]:text-purple-400 [&_blockquote]:border-l-purple-500 [&_blockquote]:text-zinc-400 [&_p]:mb-0 [&_h3]:mt-5 [&_h4]:mt-4"
            dangerouslySetInnerHTML={{ __html: processedBody }}
          />
        ) : (
          <p className="text-zinc-500 italic">No content</p>
        )}
      </main>
          <PostSidebar navigate={navigate} />
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightbox('')}>
          <button onClick={() => setLightbox('')}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 text-lg">
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
