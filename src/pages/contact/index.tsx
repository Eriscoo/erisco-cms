import { useState, type FormEvent, useEffect, useRef, useCallback } from 'react'
import { useLocale } from '../../locales'
import { ENV } from '../../constants/env'
import { submitContact } from '../../modules/contact/api'
import Header from '../../components/header'
import Footer from '../../components/footer'
import Breadcrumb from '../../components/breadcrumb'
import Button from '../../components/button'
import Modal from '../../components/modal'
import Toast from '../../components/toast'

interface Props {
  navigate: (path: string) => void
}

declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
    }
    onTurnstileLoad?: () => void
  }
}

function Contact({ navigate }: Props) {
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' })

  const widgetIdRef = useRef<string | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    document.title = t.contact.documentTitle
  }, [t])

  useEffect(() => {
    if (!successModalOpen) return
    setCountdown(10)
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          handleResetForm()
          return 10
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [successModalOpen])

  const handleResetForm = useCallback(() => {
    setName('')
    setEmail('')
    setSubject('')
    setPhone('')
    setMessage('')
    setErrors({})
    setSuccessModalOpen(false)
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (widgetIdRef.current) {
      window.turnstile?.reset(widgetIdRef.current)
    }
  }, [])

  const renderTurnstile = useCallback(() => {
    if (!turnstileContainerRef.current) return
    if (window.turnstile && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: ENV.TURNSTILE_SITE_KEY,
        theme: 'dark',
      })
    }
  }, [])

  useEffect(() => {
    if (document.querySelector('script[src*="turnstile"]')) {
      renderTurnstile()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad'
    script.async = true
    script.defer = true

    window.onTurnstileLoad = renderTurnstile

    script.onload = () => {
      if (!window.turnstile) return
      setTimeout(renderTurnstile, 0)
    }

    document.body.appendChild(script)

    return () => {
      delete window.onTurnstileLoad
    }
  }, [renderTurnstile])

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!email.trim()) {
      errs.email = t.contact.emailRequired
    } else if (!emailPattern.test(email.trim())) {
      errs.email = t.contact.emailInvalid
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return

    const token = window.turnstile?.getResponse(widgetIdRef.current || '')
    if (!token) {
      setToast({ show: true, type: 'error', message: t.contact.captchaRequired })
      return
    }

    setSubmitting(true)
    try {
      await submitContact({
        name: name.trim() || undefined,
        email: email.trim(),
        subject: subject.trim() || undefined,
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
        'cf-turnstile-response': token,
      })
      setSuccessModalOpen(true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : t.contact.failedMessage
      setToast({ show: true, type: 'error', message: msg })
      if (widgetIdRef.current) {
        window.turnstile?.reset(widgetIdRef.current)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-zinc-100 text-sm outline-none focus:border-purple-500/50 w-full'

  return (
    <div className="min-h-screen flex flex-col">
      <Header variant="default" navigate={navigate} />

      <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-8 md:py-12">
        <Breadcrumb
          variant="default"
          items={[{ label: t.nav.home, path: '/' }, { label: t.nav.contact }]}
          navigate={navigate}
          className="mb-6"
        />

        <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug mb-4">
          {t.contact.title}
        </h1>

        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 md:w-2/3">
          {t.contact.description}
        </p>

        <form onSubmit={handleSubmit} className="w-full md:w-2/3 flex flex-col gap-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              <span>{t.contact.name}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder={t.contact.namePlaceholder}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              <span>{t.contact.email}<span className="text-red-400"> *</span></span>
              <input
                type="text"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({}) }}
                className={inputClass + (errors.email ? ' border-pink-500/50' : '')}
                placeholder={t.contact.emailPlaceholder}
              />
              {errors.email && (
                <span className="text-pink-400 text-xs">{errors.email}</span>
              )}
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              <span>{t.contact.subject}</span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={inputClass}
                placeholder={t.contact.subjectPlaceholder}
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-400">
              <span>{t.contact.phone}</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder={t.contact.phonePlaceholder}
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            <span>{t.contact.message}</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className={inputClass + ' resize-y'}
              placeholder={t.contact.messagePlaceholder}
            />
          </label>

          <div ref={turnstileContainerRef} className="turnstile-widget" />

          <Button type="submit" loading={submitting} size="lg">
            {submitting ? t.contact.submitting : t.contact.submit}
          </Button>
        </form>
      </div>

      <Footer navigate={navigate} />

      <Modal open={successModalOpen} onClose={handleResetForm} title={t.contact.successTitle}>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <p className="text-emerald-200 text-base font-semibold">{t.contact.successMessage}</p>
          <p className="text-zinc-400 text-sm">{t.contact.successDescription}</p>
          <Button onClick={handleResetForm} size="md" className="mt-2">
            {t.contact.okButton} ({countdown}s)
          </Button>
        </div>
      </Modal>

      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((prev) => ({ ...prev, show: false }))} />
    </div>
  )
}

export default Contact
