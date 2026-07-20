import { useEffect } from 'react'
import { useLocale } from '../../locales'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumb from '../../components/breadcrumb'

interface Props {
  navigate: (path: string) => void
}

function Privacy({ navigate }: Props) {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.privacy.documentTitle
  }, [t])

  function handleLinkClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement
    const link = target.closest('[data-link]') as HTMLElement | null
    if (link) {
      e.preventDefault()
      const dest = link.getAttribute('data-link')
      if (dest) navigate('/' + dest)
    }
  }

  const sections = t.privacy.sections

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: t.nav.privacy }]}
          navigate={navigate}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-2">
          {t.privacy.title}
        </h1>

        <p className="text-zinc-500 text-sm mb-8">{t.privacy.lastUpdated}</p>

        <div onClick={handleLinkClick} className="post-body prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed [&_a]:text-purple-500 [&_a]:hover:text-purple-300 [&_a]:transition-colors [&_p]:mb-0 [&_h3]:mt-5 [&_h4]:mt-4 [&_li]:pl-2">
          <p>{t.privacy.intro}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.whoAmI.title}</h3>
          <p>{sections.whoAmI.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.whatIsCollected.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.whatIsCollected.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.automatically.title}</h3>
          <p>{sections.automatically.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.cookies.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.cookies.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.howUsed.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.howUsed.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.sharing.title}</h3>
          <p>{sections.sharing.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.retention.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.retention.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.security.title}</h3>
          <p>{sections.security.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.rights.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.rights.list.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.children.title}</h3>
          <p>{sections.children.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.externalLinks.title}</h3>
          <p>{sections.externalLinks.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.changes.title}</h3>
          <p>{sections.changes.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white ">{sections.contact.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: sections.contact.content }} />
        </div>

        <p className="text-zinc-500 text-sm italic border-t border-white/5 pt-6 mt-10">
          {t.privacy.footer}
        </p>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}

export default Privacy
