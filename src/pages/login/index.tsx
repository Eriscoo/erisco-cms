import { useState, type FormEvent, useEffect, useRef } from 'react'
import { useLocale } from '../../locales'
import { useAuth } from '../../modules/auth'
import LangSwitch from '../../components/language-switch'
import ThemeSwitch from '../../components/theme-switch'
import Button from '../../components/button'
import Footer from '../../components/footer'
import { useIsLight } from '../../hooks/use-is-light'
import type { ApiError } from '../../utils/api'

const COOLDOWN_KEY = 'login_cooldown_deadline'

interface Props {
  navigate: (path: string) => void
}

function getStoredCooldown(): number {
  const raw = sessionStorage.getItem(COOLDOWN_KEY)
  if (!raw) return 0
  const deadline = parseInt(raw, 10)
  const remaining = Math.ceil((deadline - Date.now()) / 1000)
  return remaining > 0 ? remaining : 0
}

function saveCooldown(seconds: number) {
  sessionStorage.setItem(COOLDOWN_KEY, String(Date.now() + seconds * 1000))
}

function clearCooldown() {
  sessionStorage.removeItem(COOLDOWN_KEY)
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
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [cooldown, setCooldown] = useState(() => {
    const stored = getStoredCooldown()
    return stored > 0 ? stored : 0
  })
  const cooldownRef = useRef(cooldown)
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  useEffect(() => {
    cooldownRef.current = cooldown
  }, [cooldown])

  useEffect(() => {
    if (cooldown <= 0) {
      clearCooldown()
      return
    }

    const timer = setInterval(() => {
      cooldownRef.current -= 1
      if (cooldownRef.current <= 0) {
        setCooldown(0)
        setError('')
        clearCooldown()
      } else {
        setCooldown(cooldownRef.current)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown])

  useEffect(() => {
    if (cooldown > 0) {
      const remaining = cooldown
      setError(t.login.tooManyAttempts.replace('{seconds}', String(remaining)))
    }
  }, [cooldown, t.login.tooManyAttempts])

  function validate(): boolean {
    let valid = true
    if (!email.trim()) {
      setEmailError(t.login.emailRequired)
      valid = false
    } else if (!emailPattern.test(email.trim())) {
      setEmailError(t.login.emailInvalid)
      valid = false
    } else {
      setEmailError('')
    }
    if (!password.trim()) {
      setPasswordError(t.login.passwordRequired)
      valid = false
    } else {
      setPasswordError('')
    }
    return valid
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!validate()) return

    try {
      await login(email, password, remember)
      clearCooldown()
      navigate('/dashboard')
    } catch (err) {
      const apiErr = err as ApiError
      if (apiErr.status === 429 && apiErr.retryAfterSeconds) {
        saveCooldown(apiErr.retryAfterSeconds)
        setCooldown(apiErr.retryAfterSeconds)
      } else {
        setError(err instanceof Error ? err.message : t.login.loginFailed)
      }
    }
  }

  const blocked = cooldown > 0

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-4 right-4 z-10 flex items-center gap-2">
        <ThemeSwitch />
        <LangSwitch />
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="rounded-2xl w-full max-w-sm flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-center">
          <img
            src={isLight ? '/assets/login/logo-dark.png' : '/assets/login/logo-light.png'}
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
            type="text"
            value={email}
            disabled={blocked}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
            className={'px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-zinc-100 text-sm outline-none focus:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed' + (emailError ? ' border-pink-500/50' : '')}
            placeholder={t.login.emailPlaceholder}
            autoFocus
          />
          {emailError && (
            <span className="text-pink-400 text-xs">{emailError}</span>
          )}
        </label>

        <label className="flex flex-col gap-1 text-sm text-zinc-400">
          <span>{t.login.password}<span className="text-red-400"> *</span></span>
          <input
            type="password"
            value={password}
            disabled={blocked}
            onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError('') }}
            className={'px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-zinc-100 text-sm outline-none focus:border-purple-500/50 disabled:opacity-40 disabled:cursor-not-allowed' + (passwordError ? ' border-pink-500/50' : '')}
            placeholder={t.login.passwordPlaceholder}
          />
          {passwordError && (
            <span className="text-pink-400 text-xs">{passwordError}</span>
          )}
        </label>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={remember} disabled={blocked} onChange={(e) => setRemember(e.target.checked)} />
            {t.login.remember}
          </label>
          <button type="button" className="bg-transparent border-0 text-purple-400 cursor-pointer text-sm p-0 hover:text-purple-300">
            {t.login.forgot}
          </button>
        </div>

        <Button type="submit" loading={loading} disabled={blocked} size="lg">
          {loading ? t.login.signingIn : blocked ? t.login.tooManyAttemptsCountdown.replace('{seconds}', String(cooldown)) : t.login.signIn}
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

      <Footer navigate={navigate} />
    </div>
  )
}

export default Login
