import { useState, type FormEvent, useEffect } from 'react'
import { useLocale } from '../../locales'
import { useAuth } from '../../modules/auth'
import LangSwitch from '../../components/language-switch'
import ThemeSwitch from '../../components/theme-switch'
import Button from '../../components/button'
import { useIsLight } from '../../hooks/use-is-light'

interface Props {
  navigate: (path: string) => void
}

function Login({ navigate }: Props) {
  const { t } = useLocale()
  const { login, loading } = useAuth()

  useEffect(() => {
    document.title = t.login.documentTitle
  }, [t])
  const isLight = useIsLight()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    try {
      await login(email, password, remember)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : t.login.loginFailed)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        <ThemeSwitch />
        <LangSwitch />
      </div>

      <form onSubmit={handleSubmit} className="bg-white/[.04] border border-white/5 rounded-2xl p-6 md:p-8 w-full max-w-sm flex flex-col gap-4 mx-4">
        <div className="flex items-center justify-center">
          <img
            src={isLight ? '/assets/header/logo-dark.png' : '/assets/header/logo-light.png'}
            alt="Erisco Blog"
            className="h-8"
          />
        </div>
        <p className="text-center text-zinc-400 text-sm -mt-2">{t.login.subtitle}</p>

        {error && (
          <div className="bg-pink-500/10 border border-pink-500/20 text-pink-400 px-3 py-2 rounded-lg text-sm">{error}</div>
        )}

        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          <span>{t.login.email}<span className="text-red-400"> *</span></span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-zinc-100 text-sm outline-none focus:border-purple-500/50"
            placeholder={t.login.emailPlaceholder}
            required
            autoFocus
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          <span>{t.login.password}<span className="text-red-400"> *</span></span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-zinc-100 text-sm outline-none focus:border-purple-500/50"
            placeholder={t.login.passwordPlaceholder}
            required
          />
        </label>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            {t.login.remember}
          </label>
          <button type="button" className="bg-transparent border-0 text-purple-400 cursor-pointer text-sm p-0 hover:text-purple-300">
            {t.login.forgot}
          </button>
        </div>

        <Button type="submit" loading={loading} size="lg">
          {loading ? t.login.signingIn : t.login.signIn}
        </Button>

        <Button variant="outline" size="lg" onClick={() => navigate('/')}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t.login.backToHome}
        </Button>
      </form>
    </div>
  )
}

export default Login
