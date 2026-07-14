interface Column<T> {
  key: string
  label: string
  render?: (item: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
  cellClassName?: string
  sortable?: boolean
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  sortKey?: string | null
  sortDir?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

function Table<T extends { id: number }>({ columns, data, sortKey, sortDir, onSort }: Props<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/5">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 shadow-[0_1px_0_0_rgba(255,255,255,0.05)]" style={{ background: '#131620' }}>
          <tr className="h-12">
            {columns.map((col) => (
              <th key={col.key} className={`text-left px-4 text-zinc-400 font-medium ${col.headerClassName ?? ''} ${col.className ?? ''}`}>
                {col.sortable && onSort ? (
                  <button
                    onClick={() => onSort(col.key)}
                    className="flex items-center gap-1 p-0 bg-transparent border-0 font-medium text-zinc-400 cursor-pointer hover:text-zinc-200 transition-colors"
                  >
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-purple-400 text-xs">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 h-12 text-center text-zinc-500">
                No data
              </td>
            </tr>
          )}
          {data.map((item, i) => (
            <tr key={item.id} className="h-12 border-b border-white/5 last:border-0 hover:bg-white/[.015]">
              {columns.map((col) => (
                <td key={col.key} className={`px-4 text-zinc-200 ${col.cellClassName ?? ''} ${col.className ?? ''}`}>
                  {col.render ? col.render(item, i) : (item as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
