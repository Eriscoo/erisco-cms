import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '../../locales'
import { useRouter } from '../../utils/router'
import { ENV } from '../../constants/env'
import { getPublicPostsByCategory, type Post } from '../../modules/posts/api'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumb from '../../components/breadcrumb'
import Button from '../../components/button'
import Spinner from '../../components/spinner'
import Pagination from '../../components/pagination'
import NotFound from '../not-found'

interface Props {
  navigate: (path: string) => void
  category: string
}

function stripHtml(html: string): string {
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent || el.innerText || ''
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max).replace(/\s+\S*$/, '') + '...'
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const date = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  const time = d.toLocaleTimeString('en-CA', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false }).replace(':', '.')
  return `${date} ${time}`
}

function CategoryPosts({ navigate, category }: Props) {
  const { t } = useLocale()
  const { prefetch } = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  const limit = 10

  const fetchPosts = useCallback(async (pageNum: number) => {
    try {
      setLoading(true)
      const data = await getPublicPostsByCategory(category, pageNum, limit)
      setPosts(data.posts)
      setTotal(data.total)
      setError(null)
      setNotFound(false)
    } catch (err) {
      const status = (err as Error & { status?: number }).status
      if (status === 404) {
        setNotFound(true)
        setError(null)
      } else {
        setError(err instanceof Error ? err.message : t.categoryPosts.failed)
        setNotFound(false)
      }
    } finally {
      setLoading(false)
    }
  }, [category, t])

  useEffect(() => {
    document.title = t.categoryPosts.documentTitle.replace('{name}', category)
    fetchPosts(1)
  }, [category, t, fetchPosts])

  function handlePageChange(p: number) {
    setPage(p)
    fetchPosts(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (notFound) {
    return <NotFound navigate={navigate} />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: t.allPosts.title, path: '/posts' }, { label: `${t.categoryPosts.breadcrumbLabel}: ${category}` }]}
          navigate={navigate}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-4">
          {t.categoryPosts.title.replace('{name}', category)}
        </h1>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          {t.categoryPosts.description.replace('{name}', category)}
        </p>

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner className="w-8 h-8 text-purple-400" />
          </div>
        ) : error && posts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-pink-400 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchPosts(1)}>{t.categoryPosts.retry}</Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 md:py-24">
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-2xl bg-purple-500/10 rounded-full animate-pulse" />
              <svg className="relative w-28 h-28 md:w-36 md:h-36 text-purple-400/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" opacity=".7" />
                <line x1="8" y1="13" x2="16" y2="13" opacity=".5" />
                <line x1="8" y1="17" x2="13" y2="17" opacity=".35" />
              </svg>
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500/20 animate-ping" />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500/30" />
            </div>

            <div className="space-y-2 max-w-sm text-center">
              <h3 className="text-xl md:text-2xl font-bold text-white">{t.categoryPosts.noPosts}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {t.categoryPosts.noPostsSub}
              </p>
            </div>

            <button
              onClick={() => navigate('/posts')}
              className="mt-8 flex items-center gap-2.5 px-5 h-10 rounded-lg text-sm font-medium text-white cursor-pointer bg-purple-600 hover:bg-purple-500 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              {t.categoryPosts.backToPosts}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => {
                const preview = truncate(stripHtml(post.body), 150)
                const categories = post.category_names ? post.category_names.split(', ').filter(Boolean) : []
                const tags = post.tag_names ? post.tag_names.split(', ').filter(Boolean) : []

                return (
                  <div
                    key={post.id}
                    className="group flex flex-col bg-zinc-900 border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/20 transition-shadow duration-300 cursor-pointer"
                    onClick={() => navigate(`/${post.slug}`)}
                    onMouseEnter={() => prefetch(`/${post.slug}`)}
                  >
                    <div className="aspect-video flex-shrink-0 overflow-hidden">
                      {post.image_url ? (
                        <img
                          src={`${ENV.API_URL}${post.image_url}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
                          loading="lazy" decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors duration-300">
                          <svg className="w-10 h-10 text-zinc-600 group-hover:text-zinc-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-4 md:p-5">
                      <h2 className="text-base md:text-lg font-semibold text-white truncate mb-1.5 group-hover:text-purple-300 transition-colors">{post.title}</h2>

                      <span className="text-xs text-zinc-500 mb-3">
                        {t.post.postedOn} {formatDate(post.published_at || post.created_at)}
                      </span>

                      <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {preview}
                      </p>

                      {(categories.length > 0 || tags.length > 0) && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {categories.map((cat) => (
                            <span
                              key={cat}
                              className="text-[11px] font-medium text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-full"
                            >
                              {cat}
                            </span>
                          ))}
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-medium text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {(error || total > limit) && (
            <div className="mt-6">
              {error ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-pink-400 text-sm">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => fetchPosts(page)}>{t.categoryPosts.retry}</Button>
                </div>
              ) : (
                <Pagination current={page} total={total} perPage={limit} onChange={handlePageChange} />
              )}
            </div>
            )}
          </>
        )}
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}

export default CategoryPosts
