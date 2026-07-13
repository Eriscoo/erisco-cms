import { useState, useRef, useEffect } from 'react'

interface Option {
  id: number
  name: string
}

interface Props {
  options: Option[]
  selected: number[]
  onChange: (ids: number[]) => void
  placeholder?: string
}

function MultiSelect({ options, selected, onChange, placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(id: number) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  const selectedNames = options.filter((o) => selected.includes(o.id)).map((o) => o.name)

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-100 cursor-pointer hover:border-white/20 transition-colors text-left min-h-[38px]">
        {selectedNames.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedNames.map((name) => (
              <span key={name} className="text-xs px-1.5 py-0.5 rounded bg-purple-600/30 text-purple-200">
                {name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-zinc-500">{placeholder || 'Select...'}</span>
        )}
        <svg className={`w-3.5 h-3.5 ml-auto flex-shrink-0 text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-zinc-900 shadow-xl max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.id)
            return (
              <button key={opt.id} type="button" onClick={() => toggle(opt.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left cursor-pointer transition-colors ${
                  isSelected ? 'bg-purple-600/20 text-purple-200' : 'text-zinc-300 hover:bg-white/5'
                }`}>
                <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-purple-600 border-purple-600' : 'border-white/20'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                {opt.name}
              </button>
            )
          })}
          {options.length === 0 && (
            <p className="px-3 py-3 text-xs text-zinc-500">No options</p>
          )}
        </div>
      )}
    </div>
  )
}

export default MultiSelect
