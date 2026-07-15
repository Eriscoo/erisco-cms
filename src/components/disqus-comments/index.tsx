import { useLayoutEffect, useRef } from 'react'

interface Props {
  shortname: string
  identifier: string
}

function DisqusComments({ shortname, identifier }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const pageUrl = window.location.href

    // Remove old config & script
    delete (window as any).disqus_config
    const old = document.getElementById('dsq-embed-scr')
    if (old) old.remove()
    const thread = document.getElementById('disqus_thread')
    if (thread) thread.innerHTML = ''

    ;(window as any).disqus_config = function (this: any) {
      this.page.url = pageUrl
      this.page.identifier = identifier
    }

    const s = document.createElement('script')
    s.src = `https://${shortname}.disqus.com/embed.js`
    s.async = true
    s.id = 'dsq-embed-scr'
    s.setAttribute('data-timestamp', String(+new Date()))
    document.body.appendChild(s)
  }, [shortname, identifier])

  return <div id="disqus_thread" ref={ref} />
}

export default DisqusComments
