import { useRouter } from '../../utils/router'

interface Crumb {
  label: string
  path?: string
}

interface Props {
  items: Crumb[]
  navigate: (path: string) => void
  variant?: 'dashboard' | 'default'
  className?: string
}

function Breadcrumb({ items, navigate, variant = 'dashboard', className = '' }: Props) {
  const isDefault = variant === 'default'
  const { prefetch } = useRouter()

  return (
    <nav className={`flex items-center text-xs text-zinc-500 ${isDefault ? 'gap-2' : 'gap-1.5'} ${className}`}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1

        return (
          <span key={i} className={`flex items-center ${isDefault ? 'gap-2' : 'gap-1.5'} ${isDefault && isLast ? 'min-w-0' : ''}`}>
            {i > 0 && (
              isDefault ? (
                <span className="text-zinc-600">/</span>
              ) : (
                <svg className="w-3 h-3 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )
            )}
            {item.path && !isLast ? (
              <button
                onClick={() => navigate(item.path!)}
                onMouseEnter={() => prefetch(item.path!)}
                className={`cursor-pointer transition-colors font-normal bg-transparent border-0 p-0 ${isDefault ? 'hover:text-purple-300 text-zinc-500' : 'text-zinc-500 hover:text-purple-400'}`}
              >
                {item.label}
              </button>
            ) : (
              <span className={`text-zinc-200 font-semibold ${isDefault ? 'truncate' : ''}`}>
                {item.label}
              </span>
            )}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
