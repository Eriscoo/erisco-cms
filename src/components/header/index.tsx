import { useEffect, useState, useRef } from 'react'
import { useRouter } from '../../utils/router'
import LangSwitch from '../language-switch'
import ThemeSwitch from '../theme-switch'
import { useLocale } from '../../locales'
import { removeToken, isLoggedIn, decodeToken } from '../../modules/auth'
import { getProfile } from '../../modules/profile/api'
import { ENV } from '../../constants/env'
import { useIsLight } from '../../hooks/use-is-light'

interface Props {
  variant: 'default' | 'dashboard'
  userName?: string
  avatarUrl?: string
  navigate: (path: string) => void
  onMenuToggle?: () => void
}

function Header({ variant, userName: propUserName, avatarUrl: propAvatarUrl, navigate, onMenuToggle }: Props) {
  const { t } = useLocale()
  const { path } = useRouter()
  const loggedIn = isLoggedIn()
  const isLight = useIsLight()
  const [userName, setUserName] = useState(propUserName || '')
  const [localAvatarUrl, setLocalAvatarUrl] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const initials = userName
    ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : ''

  const btnClass = 'px-2.5 md:px-4 py-1.5 rounded-md border border-white/10 bg-white/5 text-xs md:text-sm text-zinc-200 cursor-pointer hover:bg-white/10 whitespace-nowrap'

  function handleLogout() {
    removeToken()
    navigate('/login')
  }

  function handleMobileNav(path: string) {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const menuItems = [
    { label: t.nav.home, path: '/' },
    { label: t.nav.about, path: '/about' },
    { label: t.nav.portfolio, path: '/portfolio' },
    { label: t.nav.post, path: '/post/all' },
    { label: t.nav.contact, path: '/contact' },
  ]

  return (
    <>
      {variant === 'default' && mobileMenuOpen && (
        <div className="fixed top-[67px] inset-x-0 bottom-0 bg-black/50 z-20 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {variant === 'default' && (
        <aside className={`fixed top-[67px] bottom-0 left-0 z-30 w-60 bg-zinc-950 border-r border-white/5 transition-transform duration-300 lg:hidden flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleMobileNav(item.path)}
                className={`flex items-center h-10 rounded-lg text-sm cursor-pointer w-full px-3 gap-2.5 transition-colors ${
                path === item.path ? 'bg-purple-500/15 text-purple-300 font-medium' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-white/5 flex items-center justify-center gap-3">
            <ThemeSwitch />
            <LangSwitch />
          </div>
        </aside>
      )}

      <nav className={`h-[67px] flex items-center border-b border-white/5 bg-zinc-950 ${variant === 'default' ? 'sticky top-0 z-40' : ''}`}>
      <div className={`flex items-center justify-between px-4 md:px-8 w-full ${variant === 'default' ? 'max-w-[1280px] mx-auto' : ''}`}>
      <div className="flex items-center gap-2 lg:gap-6">
        {(variant === 'dashboard' || variant === 'default') && (
          <button
            onClick={() => variant === 'dashboard' ? onMenuToggle?.() : setMobileMenuOpen(!mobileMenuOpen)}
            className={`flex items-center justify-center w-8 h-8 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-white/5 ${variant === 'dashboard' ? 'md:hidden' : 'lg:hidden'}`}
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
          className="flex items-center no-underline"
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          <img
            src={isLight ? '/assets/header/logo-dark.png' : '/assets/header/logo-light.png'}
            alt="Erisco Blog"
            className="h-6 md:h-8"
          />
        </a>
        {variant === 'default' && (
          <div className="hidden lg:flex items-center gap-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors cursor-pointer ${
                  path === item.path ? 'bg-purple-500/15 text-purple-300 font-medium' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {variant === 'dashboard' ? (
          <div className="hidden md:flex items-center gap-2">
            <ThemeSwitch />
            <LangSwitch />
          </div>
        ) : (
          <div className="hidden lg:flex items-center gap-2 md:gap-3">
            <ThemeSwitch />
            <LangSwitch />
          </div>
        )}

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
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
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
              <svg className="w-3.5 h-3.5 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-zinc-900 border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { navigate('/dashboard/profile'); setDropdownOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {t.dashboard.profile}
                </button>
                <button
                  onClick={() => { handleLogout(); setDropdownOpen(false) }}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-pink-400 hover:bg-pink-500/10 cursor-pointer transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {t.dashboard.logout}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </nav>
    </>
  )
}

export default Header
