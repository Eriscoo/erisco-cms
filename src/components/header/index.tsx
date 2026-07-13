import { useEffect, useState, useRef } from 'react'
import viteLogo from '../../assets/images/vite.svg'
import LangSwitch from '../language-switch'
import ThemeSwitch from '../theme-switch'
import { useLocale } from '../../locales'
import { removeToken, isLoggedIn, decodeToken } from '../../modules/auth'
import { getProfile } from '../../modules/profile/api'
import { ENV } from '../../constants/env'

interface Props {
  variant: 'default' | 'dashboard'
  userName?: string
  avatarUrl?: string
  navigate: (path: string) => void
  onMenuToggle?: () => void
}

function Header({ variant, userName: propUserName, avatarUrl: propAvatarUrl, navigate, onMenuToggle }: Props) {
  const { t } = useLocale()
  const loggedIn = isLoggedIn()
  const [userName, setUserName] = useState(propUserName || '')
  const [localAvatarUrl, setLocalAvatarUrl] = useState('')

  const avatarUrl = propAvatarUrl || localAvatarUrl
  const fetched = useRef(false)

  useEffect(() => {
    if (variant !== 'dashboard') return
    const decoded = decodeToken()
    if (!decoded) return
    if (!propUserName) setUserName(decoded.name || '')
    if (propAvatarUrl) return
    if (fetched.current) return
    fetched.current = true
    getProfile(decoded.user_id).then((p) => {
      if (p?.avatar_url) setLocalAvatarUrl(p.avatar_url)
    }).catch(() => {})
  }, [variant, propUserName, propAvatarUrl])

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  const btnClass = 'px-2.5 md:px-4 py-1.5 rounded-md border border-white/10 bg-white/5 text-xs md:text-sm text-zinc-200 cursor-pointer hover:bg-white/10 whitespace-nowrap'

  function handleLogout() {
    removeToken()
    navigate('/login')
  }

  return (
    <nav className="h-[67px] flex justify-between items-center px-4 md:px-8 border-b border-white/5">
      <div className="flex items-center gap-3">
        {variant === 'dashboard' && onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
        <a
          href="/"
          className="flex items-center gap-2 text-base md:text-lg font-bold text-white no-underline"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          <img src={viteLogo} alt="" className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Erisco Blog</span>
        </a>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <ThemeSwitch />
        <LangSwitch />

        {variant === 'default' ? (
          loggedIn ? (
            <>
              <button className={btnClass} onClick={() => navigate('/dashboard')}>{t.nav.dashboard}</button>
              <button className={btnClass} onClick={handleLogout}>{t.nav.logout}</button>
            </>
          ) : (
            <button className={btnClass} onClick={() => navigate('/login')}>{t.nav.login}</button>
          )
        ) : (
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="flex items-center gap-2 px-3 md:px-4 py-1.5 rounded-md text-sm text-zinc-200 cursor-pointer hover:bg-white/5"
          >
            <span className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                <img src={ENV.API_URL + avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white text-[10px] md:text-xs font-bold">
                  {initials}
                </span>
              )}
            </span>
            <span className="hidden sm:inline">{userName}</span>
          </button>
        )}
      </div>
    </nav>
  )
}

export default Header
