import { useEffect } from 'react'
import { useLocale } from '../../locales'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumb from '../../components/breadcrumb'

interface Props {
  navigate: (path: string) => void
}

function Terms({ navigate }: Props) {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.terms.documentTitle
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

  const sections = t.terms.sections

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: t.nav.terms }]}
          navigate={navigate}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-2">
          {t.terms.title}
        </h1>

        <p className="text-zinc-500 text-sm mb-8">{t.terms.lastUpdated}</p>

        <div onClick={handleLinkClick} className="post-body prose prose-invert prose-zinc max-w-none text-zinc-300 leading-relaxed [&_a]:text-purple-500 [&_a]:hover:text-purple-300 [&_a]:transition-colors [&_p]:mb-0 [&_h3]:mt-5 [&_h4]:mt-4 [&_li]:pl-2">
          <p>{t.terms.intro}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.overview.title}</h3>
          <p>{sections.overview.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.content.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.content.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.intellectualProperty.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.intellectualProperty.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.userConduct.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.userConduct.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.thirdParty.title}</h3>
          <ul className="list-disc pl-5 space-y-3">
            {sections.thirdParty.list.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.disclaimer.title}</h3>
          <p>{sections.disclaimer.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.limitation.title}</h3>
          <p>{sections.limitation.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.changes.title}</h3>
          <p>{sections.changes.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.governing.title}</h3>
          <p>{sections.governing.content}</p>

          <h3 className="text-lg md:text-xl font-semibold text-white">{sections.contact.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: sections.contact.content }} />
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}

export default Terms
