interface Props {
  current: number
  total: number
  perPage: number
  onChange: (page: number) => void
}

function Pagination({ current, total, perPage, onChange }: Props) {
  const pages = Math.ceil(total / perPage)

  const from = (current - 1) * perPage + 1
  const to = Math.min(current * perPage, total)

  function range() {
    const start = Math.max(1, current - 2)
    const end = Math.min(pages, current + 2)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const base = 'px-2.5 py-1 rounded-md text-xs cursor-pointer transition-colors'
  const active = 'bg-purple-600 text-white'
  const idle = 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'

  return (
    <div className="flex items-center justify-between text-xs text-zinc-500">
      <span>
        {from}–{to} of {total}
      </span>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          <button disabled={current <= 1} onClick={() => onChange(current - 1)} className={`${base} ${current <= 1 ? 'opacity-30 cursor-default' : idle}`}>
            ‹
          </button>
          {range().map((p) => (
            <button key={p} onClick={() => onChange(p)} className={`${base} ${p === current ? active : idle}`}>
              {p}
            </button>
          ))}
          <button disabled={current >= pages} onClick={() => onChange(current + 1)} className={`${base} ${current >= pages ? 'opacity-30 cursor-default' : idle}`}>
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default Pagination
