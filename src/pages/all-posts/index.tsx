import { useState, useEffect, useCallback } from 'react'
import { useLocale } from '../../locales'
import { ENV } from '../../constants/env'
import { getPublicPosts, type Post } from '../../modules/posts/api'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumb from '../../components/breadcrumb'
import Button from '../../components/button'
import Spinner from '../../components/spinner'

interface Props {
  navigate: (path: string) => void
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

function AllPosts({ navigate }: Props) {
  const { t } = useLocale()
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const limit = 10

  const fetchPosts = useCallback(async (pageNum: number, append = false) => {
    try {
      if (append) setLoadingMore(true)
      else setLoading(true)

      const data = await getPublicPosts(pageNum, limit)

      if (append) {
        setPosts((prev) => [...prev, ...data.posts])
      } else {
        setPosts(data.posts)
      }
      setTotal(data.total)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : t.allPosts.failed)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [t])

  useEffect(() => {
    document.title = t.allPosts.documentTitle
    fetchPosts(1)
  }, [t, fetchPosts])

  function handleLoadMore() {
    const nextPage = page + 1
    setPage(nextPage)
    fetchPosts(nextPage, true)
  }

  const hasMore = posts.length < total

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: t.allPosts.title }]}
          navigate={navigate}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-4">
          {t.allPosts.title}
        </h1>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl">
          {t.allPosts.description}
        </p>

        {loading && posts.length === 0 ? (
          <div className="flex justify-center py-20">
            <Spinner className="w-8 h-8 text-purple-400" />
          </div>
        ) : error && posts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-pink-400 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={() => fetchPosts(1)}>{t.allPosts.retry}</Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-sm">{t.allPosts.noPosts}</p>
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
                  >
                    <div className="aspect-video flex-shrink-0 overflow-hidden">
                      {post.image_url ? (
                        <img
                          src={`${ENV.API_URL}${post.image_url}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity duration-300"
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

            {(error || hasMore) && (
            <div className="flex justify-center mt-8">
              {error ? (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-pink-400 text-sm">{error}</p>
                  <Button variant="outline" size="sm" onClick={() => fetchPosts(page, true)}>{t.allPosts.retry}</Button>
                </div>
              ) : (
                <Button variant="outline" size="lg" onClick={handleLoadMore} loading={loadingMore} disabled={loadingMore}>
                  {t.allPosts.loadMore}
                </Button>
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

export default AllPosts
