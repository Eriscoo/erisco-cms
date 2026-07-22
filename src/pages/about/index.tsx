import { useEffect } from 'react'
import { useLocale } from '../../locales'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumb from '../../components/breadcrumb'

interface Props {
  navigate: (path: string) => void
}

function About({ navigate }: Props) {
  const { t } = useLocale()

  useEffect(() => {
    document.title = t.about.documentTitle
  }, [t])

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: t.about.title }]}
          navigate={navigate}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-4">
          {t.about.title}
        </h1>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-5">
          {t.about.p1}
        </p>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-5">
          {t.about.p2}
        </p>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-5">
          {t.about.p3}
        </p>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
          {t.about.p4}
        </p>
      </div>

      <Footer navigate={navigate} />
    </div>
  )
}

export default About
