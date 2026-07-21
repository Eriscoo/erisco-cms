import { useIsLight } from '../../hooks/use-is-light'

interface Props {
  navigate: (path: string) => void
}

function Footer({ navigate }: Props) {
  const isLight = useIsLight()

  return (
    <footer className="text-xs text-zinc-600">
      <div className="bg-transparent footer-copyright-section pb-6">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <hr className="border-white/5 m-0" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex flex-col items-center gap-3 pt-6">
          {/* Desktop row */}
          <div className="hidden md:flex items-center justify-between w-full">
            <span className="flex items-center gap-3 text-zinc-400">
              <button onClick={() => navigate('/')} className="cursor-pointer bg-transparent border-0 p-0">
                <div className="h-5 w-20 flex-shrink-0">
                  <img
                    src={isLight ? '/assets/footer/footer_dark.png' : '/assets/footer/footer_light.png'}
                    alt="Eriscoo"
                    className="h-full w-full object-contain object-left"
                  />
                </div>
              </button>
              <span className="text-zinc-400">
                &copy; {new Date().getFullYear()} Eriscoo.com | All Rights Reserved.
              </span>
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

          {/* Mobile text */}
          <span className="text-center text-zinc-400 text-xs md:hidden">
            &copy; {new Date().getFullYear()} Eriscoo.com | All Rights Reserved.
          </span>
          <span className="flex items-center gap-4 md:hidden">
            <button onClick={() => navigate('/privacy-policy')} className="text-purple-400 hover:text-purple-200 transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold text-xs">
              Privacy Policy
            </button>
            <button onClick={() => navigate('/terms-and-conditions')} className="text-purple-400 hover:text-purple-200 transition-colors cursor-pointer bg-transparent border-0 p-0 font-semibold text-xs">
              T&amp;C
            </button>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
