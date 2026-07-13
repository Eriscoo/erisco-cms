interface Props {
  className?: string
}

function Spinner({ className }: Props) {
  return (
    <svg className={`animate-spin ${className ?? 'w-4 h-4'}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".15" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default Spinner
