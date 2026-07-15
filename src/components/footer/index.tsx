interface Props {
  navigate: (path: string) => void
}

function Footer({ navigate }: Props) {

  return (
    <footer className="text-xs text-zinc-600">
      <div className="bg-zinc-950 footer-copyright-section border-t border-white/5 py-6">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-center text-zinc-400">
            Copyright &copy; {new Date().getFullYear()}{' '}
            <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer bg-transparent border-0 p-0">Eriscoo.com</button>
            {' '}| All Rights Reserved.
          </span>
          <span className="flex items-center gap-4">
            <button onClick={() => navigate('/privacy-policy')} className="text-purple-400 hover:text-purple-200 transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms-and-conditions')} className="text-purple-400 hover:text-purple-200 transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold">
              T&amp;C
            </button>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
