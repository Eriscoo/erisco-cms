import { createContext, useContext, useState, type ReactNode } from 'react'
import en from './en'
import id from './id'

export type Lang = 'en' | 'id'

const locales = { en, id }

const I18nContext = createContext<{
  lang: Lang
  t: typeof en
  setLang: (lang: Lang) => void
} | null>(null)

const STORAGE_KEY = 'lang'

function getInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'id') return stored
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getInitialLang)

  function changeLang(l: Lang) {
    setLang(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <I18nContext.Provider value={{ lang, t: locales[lang], setLang: changeLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useLocale must be used within I18nProvider')
  return ctx
}
