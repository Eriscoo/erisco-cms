import { useState, useEffect, useRef } from 'react'

export function useRouter() {
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

  return { path, navigate, navigating }
}
