import { useEffect, useState, useCallback } from 'react'
import { useLocale } from '../../locales'
import { ENV } from '../../constants/env'
import { getPublicPosts, type Post } from '../../modules/posts/api'
import Header from '../../components/header'
import Footer from '../../components/footer'
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

function Home({ navigate }: Props) {
  const { t } = useLocale()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    try {
      const data = await getPublicPosts(1, 3)
      setPosts(data.posts)
    } catch {
      // silent fail — just show empty
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    document.title = 'Eriscoo | Blog, portfolio & hobbies'
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-28">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs md:text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  {t.home.welcome}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-white">{t.home.hero.headline.split(' ').slice(0, 2).join(' ')} </span>
                  <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                    {t.home.hero.headline.split(' ').slice(2).join(' ')}
                  </span>
                </h1>

                <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mb-8 mx-auto lg:mx-0">
                  {t.home.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <Button variant="gradient" size="lg" onClick={() => navigate('/portfolio')}>
                    {t.home.hero.cta}
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </Button>
                </div>
              </div>

              <div className="flex-1 max-w-md lg:max-w-none">
                <div className="relative">
                  <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/5">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      <span className="ml-2 text-xs text-zinc-500">main.go</span>
                    </div>
                      <div className="p-5 text-sm font-mono leading-relaxed">
                      <div><span className="text-purple-400">package</span> <span className="text-yellow-300">main</span></div>
                      <div className="my-1" />
                      <div><span className="text-purple-400">import</span> (<span className="text-green-400">"fmt"</span>)</div>
                      <div className="my-2" />
                      <div><span className="text-purple-400">type</span> <span className="text-blue-300">Future</span><span className="text-green-400">[T any]</span> <span className="text-purple-400">struct</span> {'{'}</div>
                      <div className="ml-4"><span className="text-blue-300">result</span> <span className="text-pink-400">chan</span> <span className="text-yellow-300">T</span></div>
                      <div>{'}'}</div>
                      <div className="my-1" />
                      <div><span className="text-purple-400">func</span> (f <span className="text-blue-300">Future</span>[<span className="text-yellow-300">T</span>]) <span className="text-blue-300">Await</span>() <span className="text-yellow-300">T</span> {'{'}</div>
                      <div className="ml-4"><span className="text-purple-400">return</span> &lt;-<span className="text-blue-300">f</span>.<span className="text-blue-300">result</span></div>
                      <div>{'}'}</div>
                      <div className="my-2" />
                      <div><span className="text-purple-400">func</span> <span className="text-blue-300">main</span>() {'{'}</div>
                      <div className="ml-4"><span className="text-zinc-400">// The future is async, but awaits you</span></div>
                      <div className="ml-4"><span className="text-blue-300">res</span> := <span className="text-yellow-300">make</span>(<span className="text-pink-400">chan</span> <span className="text-yellow-300">string</span>)</div>
                      <div className="ml-4"><span className="text-purple-400">go</span> <span className="text-purple-400">func</span>() {'{'} <span className="text-blue-300">res</span> &lt;- <span className="text-orange-400">"Hello, World!"</span>{'}'}()</div>
                      <div className="ml-4"><span className="text-yellow-300">fmt</span>.<span className="text-blue-300">Println</span>(&lt;-<span className="text-blue-300">res</span>)</div>
                      <div>{'}'}</div>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 w-16 h-16 border border-purple-500/20 rounded-xl rotate-12 hidden lg:block" />
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/10 rounded-lg -rotate-6 hidden lg:block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent posts section */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center md:text-left">
            {t.home.subtitle}
          </h2>

          <p className="text-zinc-400 text-sm md:text-base mb-8 text-center md:text-left">
            {t.home.recentPosts}
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner className="w-6 h-6 text-purple-400" />
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => {
                const preview = truncate(stripHtml(post.body), 120)
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
                      <h3 className="text-sm md:text-base font-semibold text-white truncate mb-1.5 group-hover:text-purple-300 transition-colors">
                        {post.title}
                      </h3>

                      <span className="text-xs text-zinc-500 mb-3">
                        {t.post.postedOn} {formatDate(post.published_at || post.created_at)}
                      </span>

                      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 flex-1">
                        {preview}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : null}
        </section>
      </main>

      <Footer navigate={navigate} />
    </div>
  )
}

export default Home
