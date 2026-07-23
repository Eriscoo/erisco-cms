import { useEffect, useRef, useState } from 'react'
import { useLocale } from '../../locales'
import { useIsLight } from '../../hooks/use-is-light'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Button from '../../components/button'

interface Props {
  navigate: (path: string) => void
}

const workExperience = [
  {
    role: 'Software Engineer',
    company: 'Refactory',
    period: 'March 2025 – July 2026',
    items: ['Develop front-end New DNET MMKSI Dealer Evaluation project',
      'Develop UI form for Mitsubishi Dealer Audit using Microsoft PowerApps',
      'Develop & support E-Canteen project from Berlian Sistem Informasi',
      'Develop design system project for Biofarma'
    ],
  },
  {
    role: 'Quality Assurance',
    company: 'Refactory',
    period: 'August 2024 – February 2025',
    items: [
      'E2E Automation testing for BSI HRIS',
      'Ensured quality for Kemenhub Integrated Mobile App',
      'Backend/frontend functionality and usability for MPM Security Enhancement',
      'E2E Automation testing for MPM Mytok',
      'Performed web application testing for Hanoman.id',
    ],
  },
  {
    role: 'UI/UX Designer',
    company: 'Refactory',
    period: 'January 2024 – July 2024',
    items: [
      'Design web application for MulaiKelola',
      'Design system project for Refactory Raiden UI KIT Framework',
      'Design system project for Biofarma',
      'Design web application for Smart SMS API',
      'Design web application for MPM Portal Vendor',
      'Design web application for MPM BTL Insentive',
      'Design web & mobile application for Jekoneng',
    ],
  },
  {
    role: 'Graphic Designer',
    company: 'Refactory',
    period: 'October 2019 – December 2023',
    items: [
      'Create conceptual video advertising',
      'Creating visual content for social media, websites, apps, email marketing, and online/offline advertising',
      'Maintaining all designs in accordance with brand guidelines',
    ],
  },
]

const strengths = [
  {
    name: 'Detail-Oriented',
    icon: (
      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
        <path d="M11 8v6M8 11h6" />
      </svg>
    ),
  },
  {
    name: 'Strong Collaboration',
    icon: (
      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    name: 'Continuous Learner',
    icon: (
      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    name: 'Well Organized & Documented',
    icon: (
      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

const expertise = [
  { name: 'React.js', icon: '/assets/portfolio/react.png', level: 'advanced', pct: 85 },
  { name: 'Vue.js', icon: '/assets/portfolio/vue.png', level: 'advanced', pct: 85 },
  { name: 'Go', icon: '/assets/portfolio/golang.png', level: 'intermediate', pct: 70 },
  { name: 'TypeScript', icon: '/assets/portfolio/typescript.png', level: 'intermediate', pct: 85 },
  { name: '.NET', icon: '/assets/portfolio/netframework.png', level: 'intermediate', pct: 85 },
  { name: 'Java', icon: '/assets/portfolio/java.png', level: 'intermediate', pct: 80 },
  { name: 'Figma', icon: '/assets/portfolio/figma.png', darkIcon: '/assets/portfolio/Fima_dark.png', level: 'advanced', pct: 90 },
  { name: 'SQL', icon: '/assets/portfolio/sql.png', level: 'intermediate', pct: 90 },
  { name: 'Postman', icon: '/assets/portfolio/postman.png', level: 'advanced', pct: 95 },
  { name: 'Selenium', icon: '/assets/portfolio/selenium.png', level: 'intermediate', pct: 80 },
  { name: 'Appium', icon: '/assets/portfolio/appium.png', level: 'intermediate', pct: 80 },
  { name: 'Robot Framework', icon: '/assets/portfolio/robotframework.png', darkIcon: '/assets/portfolio/robotframework_dark.png', level: 'intermediate', pct: 80 },
  { name: 'Playwright', icon: '/assets/portfolio/playwright.png', darkIcon: '/assets/portfolio/playwright_dark.png', level: 'intermediate', pct: 80 },
  { name: 'Cypress', icon: '/assets/portfolio/cypress.png', level: 'intermediate', pct: 80 },
]

const portfolioProjects = [
  {
    title: 'MMKSI Dealer Evaluation Newdnet',
    role: 'Software Engineer',
    image: '/assets/portfolio/projects/mmksinewdnet.png',
    link: "https://app-dev.mitsubishi-motors.co.id/common/",
    description:
      'MMKSI conducts an annual Dealer Performance and Facility Evaluation to assess compliance, performance, and facility standards across the dealer network.<br /><br />The current system is entirely dependent on a third-party hosted platform with no SLA, no data governance, no offline support, and no integration with D-Net or Mi-Vision.',
  },
  {
    title: 'E-Canteen Management',
    role: 'Software Engineer',
    image: '/assets/portfolio/projects/canteen.png',
    link: 'https://canteen.dev.sev-2.com',
    description:
      'E-Canteen is a web-based .NET application designed to simplify the daily management of BSI food and beverage menus for employees.<br /><br />There\'s no need for manual reporting anymore; everything is integrated into a robust web application.',
  },
  {
    title: 'MPM MyTok',
    role: 'Quality Assurance',
    image: '/assets/portfolio/projects/mpmmytok.png',
    link: 'https://play.google.com/store/apps/details?id=id.co.mytok2024.mpmdistributor&hl=id',
    description:
      'MPM MyTOK is an internal application from the MPM Group designed to facilitate employees\' digital access to various HR services and company information, such as personal data, attendance, important information, and other features that support their daily work needs.',
  },
  {
    title: 'KEMENHUB – Integrated',
    role: 'Quality Assurance',
    image: '/assets/portfolio/projects/kemenhub.png',
    link: 'https://play.google.com/store/apps/details?id=id.co.mytok2024.mpmdistributor&hl=id',
    description:
      'Integrated transportation information system. Application developed by the Ministry of Transportation of the Republic of Indonesia, specifically under the coordination of its Sub-Sectors.<br /><br />It is used for real-time monitoring and data integration of transportation activities and facilities across Indonesia, particularly during peak travel seasons such as Eid al-Fitr, Christmas and New Year holidays.',
  },
  {
    title: 'Hanoman.id',
    role: 'Quality Assurance',
    image: '/assets/portfolio/projects/hanoman.png',
    link: 'https://hanoman.id/',
    description:
      'Hanoman.id is the apps of Hanoman Indonesia System, a sales monitoring and HR system designed for companies, particularly in the FMCG sector, to manage and validate the performance of sales teams in the field. The application offers various features such as online attendance with photos and GPS, live tracking, sales reporting, automatic scheduling, and an analytics dashboard for monitoring and analyzing field data.',
  },
  {
    title: 'Jekoneng',
    role: 'UI/UX Designer',
    image: '/assets/portfolio/projects/jekoneng.png',
    link: 'https://www.instagram.com/jekoneng.indonesia',
    description:
      'The Jekoneng app is an Indonesian ride-hailing and delivery service platform that operates based on sharia principles and supports local community empowerment, particularly those connected to Islamic boarding schools (pondok pesantren), mosques, and cooperatives.',
  },
  {
    title: 'Cellcast SMS API',
    role: 'UI/UX Designer',
    image: '/assets/portfolio/projects/callcast.png',
    link: 'https://www.cellcast.com/au/features/sms-api',
    description:
      'Cellcast is an Australian mobile communications company headquartered in Melbourne. It operates as an all-in-one SMS and MMS marketing platform and gateway.<br /><br />The company provides cloud-based services, including bulk messaging, custom SMS API integrations, automation, and two-way text communication. These features help businesses seamlessly connect with customers through text, video, and images.',
  },
  {
    title: 'MulaiKelola - Xapiens',
    role: 'UI/UX Designer',
    image: '/assets/portfolio/projects/mulaikelola.png',
    link: 'https://www.moola.digital/landingpage',
    description:
      'MulaiKelola is a product or service provided by MulaiSaja to help manage information technology (IT) services effectively.<br /><br />MulaiKelola main features and functions include: Managing and tracking company technology assets, managing and responding to incidents or problems that occur in IT systems, and providing an integrated e-store to manage the purchasing process.',
  },
]

const expertiseWithIcons = expertise.filter((t) => t.icon)

function Portfolio({ navigate }: Props) {
  const { t } = useLocale()
  const isLight = useIsLight()
  const [activeProject, setActiveProject] = useState(0)
  const [paused, setPaused] = useState(false)
  const [expertisePaused, setExpertisePaused] = useState(false)
  const expertiseTrackRef = useRef<HTMLDivElement>(null)
  const expertisePosRef = useRef(0)

  useEffect(() => {
    if (expertisePaused) return
    const el = expertiseTrackRef.current
    if (!el) return

    let animId: number
    const animate = () => {
      expertisePosRef.current -= 1
      const singleSetWidth = el.scrollWidth / 2
      if (Math.abs(expertisePosRef.current) >= singleSetWidth) {
        expertisePosRef.current += singleSetWidth
      }
      el.style.transform = `translateX(${expertisePosRef.current}px)`
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [expertisePaused])

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setActiveProject((prev) => (prev + 1) % portfolioProjects.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [paused])

  useEffect(() => {
    document.title = t.portfolio.documentTitle
  }, [t])

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-28">
            <div className="text-center max-w-2xl mx-auto">
              {/* Avatar */}
              <div className="relative inline-block mb-10">
                {/* Decorative behind */}
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/10 rounded-lg -rotate-6 hidden lg:block" />

                {/* Outer ring */}
                <div className="absolute -inset-5 rounded-full border border-purple-500/10 hidden lg:block" />

                {/* Glow behind avatar */}
                <div className="absolute inset-0 w-full h-full rounded-full bg-purple-500/20 blur-2xl animate-pulse pointer-events-none" />

                {/* Avatar */}
                <div className="relative w-[150px] h-[150px] rounded-full bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent border-5 border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-500/10">
                  <img src="/assets/portfolio/avatar.jpg" alt="Erisco Berto" className="w-full h-full object-cover" />
                </div>

                {/* Decorative in front */}
                <div className="absolute -top-6 -right-6 w-16 h-16 border border-purple-500/20 rounded-xl rotate-12 hidden lg:block" />
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-white">Erisco </span>
                <span className="bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">Berto</span>
              </h1>

              {/* Location + Tag */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-8">
                <div className="inline-flex items-center gap-1.5 text-zinc-400 text-sm">
                  <svg className="w-4 h-3 rounded-[1px]" viewBox="0 0 4 3" xmlns="http://www.w3.org/2000/svg">
                    <rect width="4" height="1.5" fill="#ef4444" />
                    <rect y="1.5" width="4" height="1.5" fill="#fff" />
                  </svg>
                  Yogyakarta, Indonesia
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="text-purple-400 text-sm font-medium">#SoftwareEngineer</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="text-purple-400 text-sm font-medium">#FullStackDev</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-12 max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: t.portfolio.hero.description }} />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-y-12">
                {[
                  { label: t.portfolio.stats.experience, value: '6+ Years' },
                  { label: t.portfolio.stats.projects, value: '10+' },
                  { label: t.portfolio.stats.roles, value: '4' },
                  { label: t.portfolio.stats.expertise, value: '12+' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`text-center px-3 md:px-6 ${i < 3 ? 'sm:border-r border-zinc-700/20' : ''}`}
                  >
                    <div className="text-lg md:text-xl font-bold text-purple-400">{stat.value}</div>
                    <div className="text-[12px] text-zinc-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section divider */}
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* Strengths Section */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t.portfolio.strengths.title}</h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">{t.portfolio.strengths.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {strengths.map((s) => (
              <div
                key={s.name}
                className="group bg-zinc-900 border border-white/5 rounded-xl p-6 text-center hover:border-purple-500/20 hover:bg-white/5 transition-shadow duration-300"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/15">
                  {s.icon}
                </div>
                <h3 className="text-white text-sm font-semibold">{s.name}</h3>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 md:mt-10">
            <a
              href="#expertise"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('expertise')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t.portfolio.strengths.seeMyExpertise}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
        </section>

        {/* Work Experience */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.02] to-transparent pointer-events-none" />
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t.portfolio.experience.title}</h2>
              <p className="text-zinc-400 text-sm md:text-base">{t.portfolio.experience.subtitle}</p>
            </div>

            <div className="relative max-w-3xl mx-auto">
              {/* Timeline line - desktop */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent -translate-x-1/2 hidden md:block" />
              {/* Timeline line - mobile */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent -translate-x-1/2 md:hidden" />

              <div className="space-y-8">
                {workExperience.map((exp, idx) => (
                  <div
                    key={idx}
                    className={`relative flex flex-col md:flex-row gap-4 md:gap-12 ${
                      idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-purple-500 border-2 border-zinc-950 shadow-lg shadow-purple-500/20 -translate-x-1/2 top-0 z-10" />

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />

                    {/* Card */}
                    <div className="flex-1 ml-12 md:ml-0">
                      <div className="bg-zinc-900 border border-white/5 rounded-xl p-5 md:p-6 hover:border-purple-500/20">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                            {exp.period}
                          </span>
                        </div>
                        <h3 className="text-white font-semibold text-base md:text-lg mb-1">
                          {exp.role}
                          <span className="text-purple-400"> @ {exp.company}</span>
                        </h3>
                        <ul className="mt-3 space-y-1.5">
                          {exp.items.map((item, i) => (
                            <li key={i} className="flex items-baseline gap-2 text-zinc-400 text-sm leading-relaxed">
                              <span className="text-purple-400 flex-shrink-0">&#x2022;</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="relative bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-y border-purple-500/20">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t.portfolio.education.title}</h2>
              <p className="text-zinc-400 text-sm md:text-base">{t.portfolio.education.subtitle}</p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/20">
                {[
                  {
                    school: t.portfolio.education.schools.university,
                    degree: t.portfolio.education.degrees.civilEngineering,
                    year: '2019',
                    label: t.portfolio.education.labels.university,
                    icon: (
                      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
                      </svg>
                    ),
                  },
                  {
                    school: t.portfolio.education.schools.vocational,
                    degree: t.portfolio.education.degrees.computerNetwork,
                    year: '2014',
                    label: t.portfolio.education.labels.seniorHighSchool,
                    icon: (
                      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                        <line x1="8" y1="21" x2="16" y2="21" />
                        <line x1="12" y1="17" x2="12" y2="21" />
                      </svg>
                    ),
                  },
                  {
                    school: t.portfolio.education.schools.juniorHigh,
                    degree: t.portfolio.education.degrees.general,
                    year: '2011',
                    label: t.portfolio.education.labels.juniorHighSchool,
                    icon: (
                      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    ),
                  },
                  {
                    school: t.portfolio.education.schools.elementary,
                    degree: t.portfolio.education.degrees.general,
                    year: '2008',
                    label: t.portfolio.education.labels.elementarySchool,
                    icon: (
                      <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    ),
                  },
                ].map((edu, idx) => (
                  <div key={edu.school} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] ${idx < 3 ? 'border-b border-white/5' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      {edu.icon}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                      <div>
                        <h3 className="text-white font-semibold text-sm md:text-base">{edu.school}</h3>
                        <p className="text-zinc-400 text-sm">{edu.degree}<span className="text-zinc-600"> &middot; {edu.label}</span></p>
                      </div>
                      <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full flex-shrink-0 self-start sm:self-center">{edu.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* My Expertise */}
        <section id="expertise" className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t.portfolio.expertise.title}</h2>
            <p className="text-zinc-400 text-sm md:text-base">{t.portfolio.expertise.subtitle}</p>
          </div>
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setExpertisePaused(!expertisePaused)}
              className="text-zinc-500 hover:text-purple-400 transition-colors cursor-pointer bg-transparent border-0 p-1"
              title={expertisePaused ? 'Play' : 'Pause'}
            >
              {expertisePaused ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <rect x="5" y="3" width="5" height="18" />
                  <rect x="14" y="3" width="5" height="18" />
                </svg>
              )}
            </button>
          </div>
          <div className="overflow-hidden">
            <div
              ref={expertiseTrackRef}
              className="flex gap-8"
            >
              {[...expertiseWithIcons, ...expertiseWithIcons].map((tech, idx) => (
                <div
                  key={`${tech.name}-${idx}`}
                  title={tech.name}
                  className="h-10 w-auto flex items-center justify-center flex-shrink-0"
                >
                  <img src={!isLight && tech.darkIcon ? tech.darkIcon : tech.icon} alt={tech.name} className="h-full w-auto object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 max-w-3xl mx-auto space-y-3">
            {expertise.map((tech) => (
              <div key={tech.name} className="flex items-center gap-3 group cursor-default">
                <span className="text-xs text-zinc-400 w-28 flex-shrink-0 text-right group-hover:text-zinc-200">{tech.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-zinc-600 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700 group-hover:from-purple-400 group-hover:to-purple-300 group-hover:shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                    style={{ width: `${tech.pct}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-8 flex-shrink-0 group-hover:text-purple-400 group-hover:font-semibold">{tech.pct}%</span>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio Projects */}
        <section className="bg-white/[0.02]">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{t.portfolio.projects.title}</h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto">{t.portfolio.projects.subtitle}</p>
            </div>

            <div className="flex gap-8 lg:gap-12">
              {/* Left: Dot navigation */}
              <div className="hidden lg:flex flex-col items-center gap-4 pt-6 flex-shrink-0">
                <button
                  onClick={() => setPaused(!paused)}
                  className="text-zinc-500 hover:text-purple-400 transition-colors cursor-pointer bg-transparent border-0 p-1"
                  title={paused ? 'Play' : 'Pause'}
                >
                  {paused ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="6 3 20 12 6 21 6 3" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <rect x="5" y="3" width="5" height="18" />
                      <rect x="14" y="3" width="5" height="18" />
                    </svg>
                  )}
                </button>
                {portfolioProjects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveProject(idx)}
                    className={`w-2.5 h-2.5 rounded-full cursor-pointer border-0 p-0 ${
                      idx === activeProject
                        ? 'bg-purple-500 shadow-lg shadow-purple-500/30'
                        : 'bg-zinc-700 hover:bg-zinc-500'
                    }`}
                  />
                ))}
              </div>

              {/* Right: Active project */}
              <div className="flex-1 min-w-0">
                {(() => {
                  const project = portfolioProjects[activeProject]
                  return (
                    <div className={`flex flex-col ${activeProject % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-start gap-12`}>
                      <div className="lg:w-3/5 w-full relative">
                        {/* Glow behind */}
                        <div className="absolute -inset-2 bg-purple-500/10 blur-2xl pointer-events-none hidden lg:block" />
                        {/* Bottom-left decorative */}
                        <div className="absolute -bottom-3 -left-3 w-10 h-10 bg-purple-500/10 rounded-lg -rotate-6 pointer-events-none hidden lg:block" />
                        {project.image && (
                          <img src={project.image} alt={project.title} className="relative w-full object-cover aspect-video rounded-lg" loading="lazy" />
                        )}
                        {/* Top-right decorative in front */}
                        <div className="absolute -top-4 -right-4 w-14 h-14 border border-purple-500/20 rounded-xl rotate-12 pointer-events-none hidden lg:block" />
                      </div>

                      <div className="lg:w-2/5 w-full bg-zinc-900 border border-white/5 rounded-xl p-5 md:p-6 hover:border-purple-500/20">
                        <h3 className="text-white font-semibold text-base md:text-lg leading-tight mb-3">
                          {project.title}
                        </h3>
                        <span className="inline-block text-xs font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full mb-3">
                          {project.role}
                        </span>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: project.description }} />
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            {t.portfolio.projects.visitWebsite}
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {/* Project counter */}
                <div className="flex items-center justify-center gap-2 mt-8 lg:hidden">
                  {portfolioProjects.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveProject(idx)}
                      className={`w-2.5 h-2.5 rounded-full border-0 p-0 ${
                        idx === activeProject ? 'bg-purple-500 shadow-lg shadow-purple-500/30' : 'bg-zinc-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section divider */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>

        {/* CTA Section */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 p-16 md:p-20 text-center">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <h2 className="text-xl md:text-3xl font-bold text-white mb-3 relative z-10">{t.portfolio.cta.title}</h2>
            <p className="text-zinc-400 text-sm md:text-base mb-6 max-w-2xl mx-auto relative z-10">{t.portfolio.cta.text}</p>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <Button variant="gradient" size="lg" onClick={() => navigate('/contact')}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {t.portfolio.cta.contact}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer navigate={navigate} />
    </div>
  )
}

export default Portfolio
