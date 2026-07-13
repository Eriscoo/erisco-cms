import { useLocale } from '../../locales'
import Header from '../../components/header'

interface Props {
  navigate: (path: string) => void
}

function Home({ navigate }: Props) {
  const { t } = useLocale()

  return (
    <div>
      <Header variant="default" navigate={navigate} />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-67px)] gap-2 px-4 md:px-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white">{t.home.welcome}</h1>
        <p className="text-zinc-400 text-sm md:text-base">{t.home.subtitle}</p>
      </main>
    </div>
  )
}

export default Home
