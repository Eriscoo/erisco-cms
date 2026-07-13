import { useState, useEffect } from 'react'
import { useLocale } from '../../locales'
import LangSwitch from '../language-switch'
import ThemeSwitch from '../theme-switch'

interface MenuItem {
  key: string
  label: string
  path: string
  icon: React.ReactNode
}

interface Props {
  currentPath: string
  navigate: (path: string) => void
  open: boolean
  onClose: () => void
}

const iconSize = 'w-4 h-4'

function Sidebar({ currentPath, navigate, open, onClose }: Props) {
  const { t } = useLocale()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true')

  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', String(collapsed))
  }, [collapsed])

  const menu: MenuItem[] = [
    {
      key: 'dashboard',
      label: t.dashboard.title,
      path: '/dashboard',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    {
      key: 'posts',
      label: t.sidebar.posts,
      path: '/dashboard/posts',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
    },
    {
      key: 'settings',
      label: t.sidebar.settings,
      path: '/dashboard/settings',
      icon: (
        <svg className={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ]

  function handleNav(path: string) {
    navigate(path)
    onClose()
  }

  return (
    <>
      {open && <div className="fixed top-[67px] inset-x-0 bottom-0 bg-black/50 z-20 md:hidden" onClick={onClose} />}

      <aside className={`${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative top-[67px] md:top-0 bottom-0 z-30 md:z-auto overflow-hidden flex flex-col border-r border-white/5 bg-zinc-950 md:bg-white/[.02] transition-[transform,width] duration-300 ${collapsed ? 'md:w-[68px]' : 'md:w-60'} w-60`}>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-2">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNav(item.path)}
              className={`flex items-center h-10 rounded-lg text-sm cursor-pointer transition-colors w-full px-3 ${collapsed ? 'md:justify-center md:gap-0' : 'gap-2.5'} ${
                currentPath === item.path
                  ? 'bg-purple-500/15 text-purple-300 font-medium'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {item.icon}
              </span>
              <span className={`whitespace-nowrap transition-[opacity,width] duration-300 ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'md:opacity-100 md:w-auto'}`}>
                {item.label}
              </span>
            </button>
          ))}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`hidden md:flex items-center h-10 rounded-lg text-sm cursor-pointer transition-colors w-full px-3 ${collapsed ? 'md:justify-center md:gap-0' : 'gap-2.5'} text-zinc-500 hover:text-zinc-300 mt-auto`}
          >
            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
              <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </span>
            <span className={`whitespace-nowrap transition-[opacity,width] duration-300 ${collapsed ? 'md:opacity-0 md:w-0 md:overflow-hidden' : 'md:opacity-100 md:w-auto'}`}>{t.sidebar.collapse}</span>
          </button>
        </nav>

        <div className="px-3 py-4 border-t border-white/5 flex items-center justify-center gap-3 md:hidden">
          <ThemeSwitch />
          <LangSwitch />
        </div>
      </aside>
    </>
  )
}

export default Sidebar
