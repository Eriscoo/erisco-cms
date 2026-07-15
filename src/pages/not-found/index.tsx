import { useEffect } from 'react'
import { useLocale } from '../../locales'
import Header from '../../components/header'

interface Props {
  navigate: (path: string) => void
}

function NotFound({ navigate }: Props) {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.notFound.documentTitle
  }, [t])

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="flex flex-col items-center gap-6 md:gap-8 max-w-md text-center">
          <svg className="w-32 h-32 md:w-44 md:h-44 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" opacity=".3" />
            <circle cx="12" cy="12" r="7" opacity=".4" />
            <circle cx="12" cy="12" r="4" opacity=".5" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity=".6" />
            <path d="M12 8v2" opacity=".6" strokeWidth="1.5" />
            <path d="M12 14v2" opacity=".6" strokeWidth="1.5" />
            <line x1="22" y1="12" x2="19" y2="12" opacity=".4" strokeWidth="1.5" />
            <line x1="5" y1="12" x2="2" y2="12" opacity=".4" strokeWidth="1.5" />
            <line x1="12" y1="2" x2="12" y2="5" opacity=".4" strokeWidth="1.5" />
            <line x1="12" y1="19" x2="12" y2="22" opacity=".4" strokeWidth="1.5" />
            <line x1="4.93" y1="4.93" x2="7.05" y2="7.05" opacity=".35" strokeWidth="1.5" />
            <line x1="16.95" y1="16.95" x2="19.07" y2="19.07" opacity=".35" strokeWidth="1.5" />
            <line x1="19.07" y1="4.93" x2="16.95" y2="7.05" opacity=".35" strokeWidth="1.5" />
            <line x1="7.05" y1="16.95" x2="4.93" y2="19.07" opacity=".35" strokeWidth="1.5" />
          </svg>

          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-bold text-purple-400/30 leading-none">404</h1>
            <h2 className="text-xl md:text-2xl font-bold text-white">{t.notFound.title}</h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              {t.notFound.subtitle}
            </p>
            <p className="text-zinc-500 text-xs md:text-sm">
              {t.notFound.checkUrl}
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 px-4 h-10 rounded-lg text-sm font-medium text-white cursor-pointer bg-purple-600 hover:bg-purple-500 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {t.notFound.backHome}
          </button>
        </div>
      </main>
    </div>
  )
}

export default NotFound
