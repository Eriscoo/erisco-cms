import { useLocale, type Lang } from '../../locales'

function FlagID({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="8" fill="#EF4444" rx="1" />
      <rect x="2" y="12" width="20" height="8" fill="#E5E5E5" rx="1" />
    </svg>
  )
}

function FlagGB({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" fill="#1D4ED8" rx="1" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="#fff" strokeWidth="4" />
      <line x1="12" y1="4" x2="12" y2="20" stroke="#fff" strokeWidth="4" />
      <line x1="2" y1="4" x2="22" y2="20" stroke="#fff" strokeWidth="2" />
      <line x1="22" y1="4" x2="2" y2="20" stroke="#fff" strokeWidth="2" />
      <line x1="2" y1="4" x2="22" y2="20" stroke="#EF4444" strokeWidth="1" />
      <line x1="22" y1="4" x2="2" y2="20" stroke="#EF4444" strokeWidth="1" />
    </svg>
  )
}

const flags: Record<Lang, React.FC<{ className?: string }>> = { en: FlagGB, id: FlagID }

interface Props {
  compact?: boolean
}

function LangSwitch({ compact }: Props) {
  const { lang, setLang } = useLocale()
  const Flag = flags[lang]

  function toggle() {
    setLang(lang === 'id' ? 'en' : 'id')
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-zinc-400 cursor-pointer hover:text-zinc-200 whitespace-nowrap"
      >
        <Flag className="w-4 h-4" />
        {lang === 'en' ? 'EN' : 'ID'}
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-zinc-400 cursor-pointer hover:bg-white/5 hover:text-zinc-200 transition-colors"
    >
      <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        <Flag className="w-5 h-5" />
      </span>
      {lang === 'en' ? 'EN' : 'ID'}
    </button>
  )
}

export default LangSwitch
