import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react'

interface RouterState {
  path: string
  navigate: (to: string) => void
  navigating: boolean
}

const RouterContext = createContext<RouterState | null>(null)

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(window.location.pathname)
  const [navigating, setNavigating] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onChange() {
      setPath(window.location.pathname)
    }
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])

  function navigate(to: string) {
    if (to === path) return
    setNavigating(true)
    window.history.pushState({}, '', to)
    setPath(to)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setNavigating(false), 400)
  }

  return (
    <RouterContext.Provider value={{ path, navigate, navigating }}>
      {children}
    </RouterContext.Provider>
  )
}

export function useRouter() {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}
