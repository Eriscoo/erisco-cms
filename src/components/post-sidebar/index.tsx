import { useState, useEffect, useRef } from 'react'
import { useLocale } from '../../locales'
import { getPublicPosts, type Post } from '../../modules/posts/api'
import { ENV } from '../../constants/env'

interface Props {
  navigate: (path: string) => void
}

function PostSidebar({ navigate }: Props) {
  const { t } = useLocale()
  const [posts, setPosts] = useState<Post[]>([])
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    getPublicPosts().then(setPosts).catch(() => {})
  }, [])

  const [loading, setLoading] = useState(true)
  const recent = posts.slice(0, 5)

  function formatRelativeTime(dateStr: string | null) {
    if (!dateStr) return ''
    const now = new Date()
    const then = new Date(dateStr)
    const diffMs = now.getTime() - then.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHr = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)
    const diffWeek = Math.floor(diffDay / 7)
    const diffMonth = Math.floor(diffDay / 30)
    const diffYear = Math.floor(diffDay / 365)

    if (diffSec < 60) return t.time.now
    if (diffMin < 60) return formatUnit(diffMin, 'minute')
    if (diffHr < 24) return formatUnit(diffHr, 'hour')
    if (diffDay < 7) return formatUnit(diffDay, 'day')
    if (diffWeek < 5) return formatUnit(diffWeek, 'week')
    if (diffMonth < 12) return formatUnit(diffMonth, 'month')
    return formatUnit(diffYear, 'year')
  }

  function formatUnit(n: number, unit: string) {
    const raw = t.time[unit as keyof typeof t.time]
    if (!raw.includes('|')) return `${n} ${raw}`
    const [singular, plural] = raw.split('|').map(s => s.trim())
    return `${n} ${n === 1 ? singular : plural}`
  }

  useEffect(() => {
    if (posts.length > 0) setLoading(false)
  }, [posts])

  return (
    <aside className="w-full lg:w-[324px] shrink-0">
      <div className="sticky top-[115px]">
        <h3 className="text-lg md:text-2xl font-bold text-zinc-200 mb-2 pb-2 border-b border-white/5">
          {t.sidebar.recentPosts}
        </h3>
        <div className="flex flex-col">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 py-4 border-b border-white/5 last:border-b-0 items-start h-[106px]">
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="h-4 bg-white/[0.06] rounded w-full" />
                    <div className="h-4 bg-white/[0.06] rounded w-2/3" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                  </div>
                  <div className="w-[74px] h-[74px] rounded-lg bg-white/[0.04] shrink-0" />
                </div>
              ))
            : recent.map((post) => (
                <button
                  key={post.id}
                  onClick={() => navigate(`/${post.slug}`)}
                  className="flex gap-3 py-4 text-left bg-transparent border-0 border-b border-white/5 p-0 cursor-pointer group w-full last:border-b-0 items-start h-[106px]"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-zinc-300 group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                      {post.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1.5">
                      {formatRelativeTime(post.published_at || post.created_at)}
                    </p>
                  </div>
                  <div className="w-[74px] h-[74px] rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                    {post.image_url ? (
                      <img
                        src={`${ENV.API_URL}${post.image_url}`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                </button>
              ))}
        </div>
      </div>
    </aside>
  )
}

export default PostSidebar
