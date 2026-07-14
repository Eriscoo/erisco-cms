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

  const recent = posts.slice(0, 5)

  function formatDate(dateStr: string | null) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  }

  if (recent.length === 0) return null

  return (
    <aside className="w-full lg:w-[324px] shrink-0">
      <div className="sticky top-[115px]">
        <h3 className="text-2xl font-bold text-zinc-200 mb-2 pb-2 border-b border-white/5">
          {t.sidebar.recentPosts}
        </h3>
        <div className="flex flex-col">
          {recent.map((post) => (
            <button
              key={post.id}
              onClick={() => navigate(`/post/${post.slug}`)}
              className="flex gap-3 py-3 text-left bg-transparent border-0 border-b border-white/5 p-0 cursor-pointer group w-full last:border-b-0 items-center"
            >
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-zinc-300 group-hover:text-purple-300 transition-colors line-clamp-2 leading-relaxed">
                  {post.title}
                </h4>
                <p className="text-xs text-zinc-500 mt-1.5">
                  {formatDate(post.published_at || post.created_at)}
                </p>
              </div>
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
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
