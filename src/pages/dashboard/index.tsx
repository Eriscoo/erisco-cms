import { useState, useEffect } from 'react'
import { useLocale } from '../../locales'
import Breadcrumb from '../../components/breadcrumb'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'

interface Props {
  navigate: (path: string) => void
}

function Dashboard({ navigate }: Props) {
  const { t } = useLocale()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    document.title = t.dashboard.documentTitle
  }, [t])

  return (
    <div className="flex flex-col h-screen">
      <Header variant="dashboard" navigate={navigate} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentPath="/dashboard"
          navigate={navigate}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Breadcrumb
            items={[
              { label: t.dashboard.title },
            ]}
            navigate={navigate}
          />
          <h1 className="text-lg md:text-xl font-semibold text-white mt-4">{t.dashboard.greeting} Erisco Berto</h1>
          <p className="text-zinc-400 text-sm mt-2">{t.dashboard.welcome}</p>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
