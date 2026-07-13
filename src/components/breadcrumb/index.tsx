interface Crumb {
  label: string
  path?: string
}

interface Props {
  items: Crumb[]
  navigate: (path: string) => void
}

function Breadcrumb({ items, navigate }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
      {items.map((item, i) => {
        const isLast = i === items.length - 1

        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg className="w-3 h-3 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            {item.path && !isLast ? (
              <button
                onClick={() => navigate(item.path!)}
                className="text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors"
              >
                {item.label}
              </button>
            ) : (
              <span className={isLast ? 'text-zinc-200' : 'text-zinc-500'}>
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
