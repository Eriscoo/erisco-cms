import { useEffect, type ReactNode } from 'react'

interface Props {
  show: boolean
  type: 'success' | 'error'
  message: string | ReactNode
  onClose: () => void
  duration?: number
}

function Toast({ show, type, message, onClose, duration = 3000 }: Props) {
  useEffect(() => {
    if (!show) return
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [show, onClose, duration])

  if (!show) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm ${
        type === 'success'
          ? 'bg-emerald-900/80 border-emerald-700/40 text-emerald-200'
          : 'bg-pink-900/80 border-pink-700/40 text-pink-200'
      }`}>
        {type === 'success' ? (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ) : (
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        )}
        {message}
        <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Toast
