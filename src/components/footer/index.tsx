interface Props {
  navigate: (path: string) => void
}

function Footer({ navigate }: Props) {
  return (
    <footer className="border-t border-white/5 py-6 text-xs text-zinc-600">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between">
        <span>
          <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-0 p-0">
            Erisco Blog
          </button>
          {' '}&copy; {new Date().getFullYear()} | All Right Reserved.
        </span>
        <span className="flex items-center gap-4">
          <button onClick={() => navigate('/privacy-policy')} className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-0 p-0">
            Privacy Policy
          </button>
          <button onClick={() => navigate('/terms')} className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-0 p-0">
            T&amp;C
          </button>
        </span>
      </div>
    </footer>
  )
}

export default Footer
