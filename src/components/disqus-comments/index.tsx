import { useEffect, useRef, useState } from 'react'

interface Props {
  identifier: string
}

const SHORTNAME = 'eriscoo-com'

function DisqusComments({ identifier }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)
  const [scheme, setScheme] = useState<'light' | 'dark'>(
    () => document.documentElement.classList.contains('light') ? 'light' : 'dark'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isLight = document.documentElement.classList.contains('light')
      setScheme(isLight ? 'light' : 'dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const pageUrl = window.location.href
    const w = window as any

    if (loaded.current && w.DISQUS) {
      w.DISQUS.reset({
        reload: true,
        config: function (this: any) {
          this.page.url = pageUrl
          this.page.identifier = identifier
          this.page.color_scheme = scheme
        },
      })
      return
    }

    loaded.current = true

    if (ref.current) ref.current.innerHTML = ''

    const thread = document.createElement('div')
    thread.id = 'disqus_thread'
    ref.current.appendChild(thread)

    w.disqus_config = function (this: any) {
      this.page.url = pageUrl
      this.page.identifier = identifier
      this.page.color_scheme = scheme
    }

    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.async = true
    s.src = `https://${SHORTNAME}.disqus.com/embed.js`
    s.setAttribute('data-timestamp', String(+new Date()))
    document.body.appendChild(s)
  }, [identifier, scheme])

  return <div ref={ref} />
}

export default DisqusComments
