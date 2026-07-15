import { useEffect } from 'react'
import { useLocale } from '../../locales'
import Header from '../../components/header'
import Button from '../../components/button'

interface Props {
  navigate: (path: string) => void
}

function Home({ navigate }: Props) {
  const { t } = useLocale()

  useEffect(() => {
    document.title = 'Eriscoo | Blog, portfolio & hobbies'
  }, [])

  return (
    <div>
      <Header variant="default" navigate={navigate} />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 md:py-32">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 text-purple-300 text-xs md:text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  {t.home.welcome}
                </div>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  <span className="text-white">{t.home.hero.headline.split(' ').slice(0, 3).join(' ')} </span>
                  <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                    {t.home.hero.headline.split(' ').slice(3).join(' ')}
                  </span>
                </h1>

                <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mb-8 mx-auto lg:mx-0">
                  {t.home.hero.description}
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
                  <Button variant="gradient" size="lg" onClick={() => navigate('/post')}>
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

              {/* Right Decorative */}
              <div className="flex-1 max-w-md lg:max-w-none">
                <div className="relative">
                  {/* Code snippet card */}
                  <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/5">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      <span className="ml-2 text-xs text-zinc-500">index.tsx</span>
                    </div>
                    <div className="p-5 text-sm font-mono leading-relaxed">
                      <div><span className="text-purple-400">import</span> <span className="text-green-400">{'{'}</span> <span className="text-blue-300">useState</span> <span className="text-green-400">{'}'}</span> <span className="text-purple-400">from</span> <span className="text-yellow-300">'react'</span></div>
                      <div className="my-2" />
                      <div><span className="text-purple-400">const</span> <span className="text-blue-300">App</span> = <span className="text-green-400">{'()'}</span> <span className="text-pink-400">{'=>'}</span> {'{'}</div>
                      <div className="ml-4"><span className="text-purple-400">const</span> [<span className="text-blue-300">ready</span>, <span className="text-blue-300">setReady</span>] = <span className="text-yellow-300">useState</span>(<span className="text-orange-400">false</span>)</div>
                      <div className="my-1" />
                      <div className="ml-4"><span className="text-purple-400">return</span> {'<'}<span className="text-pink-400">div</span>{'>'}</div>
                      <div className="ml-8"><span className="text-green-400">{'{'}</span><span className="text-zinc-400">/* Build the future */</span><span className="text-green-400">{'}'}</span></div>
                      <div className="ml-4">{'</'}<span className="text-pink-400">div</span>{'>'}</div>
                      <div>{'}'}</div>
                    </div>
                  </div>

                  {/* Floating decorative elements */}
                  <div className="absolute -top-6 -right-6 w-16 h-16 border border-purple-500/20 rounded-xl rotate-12 hidden lg:block" />
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/10 rounded-lg -rotate-6 hidden lg:block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent posts section placeholder */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1 bg-white/5" />
            <h2 className="text-lg font-semibold text-zinc-300">{t.home.subtitle}</h2>
            <div className="h-px flex-1 bg-white/5" />
          </div>
          <p className="text-center text-zinc-500 text-sm">{t.home.hero.cta} →</p>
        </section>
      </main>
    </div>
  )
}

export default Home
