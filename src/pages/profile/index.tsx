import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useLocale } from '../../locales'
import { api } from '../../utils/api'
import { getProfile, updateProfile, type UpdateProfileReq } from '../../modules/profile/api'
import { removeToken, decodeToken } from '../../modules/auth'
import Breadcrumb from '../../components/breadcrumb'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Toast from '../../components/toast'

interface Props {
  navigate: (path: string) => void
}

const BASE = 'http://localhost:8080'

function Profile({ navigate }: Props) {
  const { t } = useLocale()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<UpdateProfileReq>({})
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' })
  const fileRef = useRef<HTMLInputElement>(null)
  const fetchedRef = useRef(false)

  function handleLogout() {
    removeToken()
    navigate('/login')
  }

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    async function init() {
      try {
        const decoded = decodeToken()
        if (!decoded) return
        setUserId(decoded.user_id)
        const p = await getProfile(decoded.user_id)
        if (p) {
          setForm({ bio: p.bio, website: p.website, location: p.location, phone: p.phone, avatar_url: p.avatar_url })
          if (p.avatar_url) setAvatarPreview(BASE + p.avatar_url)
        }
      } catch {}
      setLoading(false)
    }
    init()
  }, [])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024) {
      setToast({ show: true, type: 'error', message: 'File too large. Max 500 KB' })
      e.target.value = ''
      return
    }
    setPendingFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSaving(true)

    try {
      let url = form.avatar_url || ''

      if (pendingFile) {
        const fd = new FormData()
        fd.append('file', pendingFile)
        const res = await api.post<{ url: string }>('/api/v1/upload', fd)
        url = res.url
        setPendingFile(null)
      }

      await updateProfile(userId, { ...form, avatar_url: url })
      setForm((prev) => ({ ...prev, avatar_url: url }))
      setToast({ show: true, type: 'success', message: 'Profile updated' })
    } catch (err) {
      setToast({ show: true, type: 'error', message: err instanceof Error ? err.message : 'Failed' })
    }
    setSaving(false)
  }

  function update(field: keyof UpdateProfileReq, value: string) {
    if (field === 'phone') value = value.replace(/[^0-9+]/g, '')
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const fields: { key: keyof UpdateProfileReq; label: string; placeholder: string; maxLength: number }[] = [
    { key: 'bio', label: 'Bio', placeholder: 'Tulis bio singkat...', maxLength: 200 },
    { key: 'website', label: 'Website', placeholder: 'https://', maxLength: 255 },
    { key: 'location', label: 'Location', placeholder: 'Kota, Negara', maxLength: 100 },
    { key: 'phone', label: 'Phone', placeholder: '+62...', maxLength: 20 },
  ]

  const avatarSrc = avatarPreview || (form.avatar_url ? BASE + form.avatar_url : null)

  return (
    <div className="flex flex-col h-screen">
      <Header variant="dashboard" avatarUrl={form.avatar_url} navigate={navigate} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPath="/dashboard/profile" navigate={navigate} onLogout={handleLogout} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Breadcrumb items={[{ label: t.dashboard.title, path: '/dashboard' }, { label: 'Profile' }]} navigate={navigate} />

          {loading ? (
            <p className="text-zinc-500 text-sm mt-6">Loading...</p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 max-w-lg flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => fileRef.current?.click()} className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer group">
                  {avatarSrc ? (
                    <img src={avatarSrc} className="w-full h-full object-cover" alt="avatar" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-teal-400 flex items-center justify-center text-white text-xl font-bold">
                      EB
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">{saving ? '...' : 'Edit'}</span>
                  </div>
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

                <div>
                  <p className="text-white font-semibold">Erisco Berto</p>
                  <p className="text-zinc-500 text-sm">ID: {userId}</p>
                </div>
              </div>

              {fields.map((f) => {
                const val = form[f.key] ?? ''
                const over = val.length > f.maxLength
                return (
                <label key={f.key} className="flex flex-col gap-1.5 text-sm text-zinc-400">
                  <div className="flex justify-between">
                    <span>{f.label}</span>
                    <span className={`text-xs ${over ? 'text-pink-400' : 'text-zinc-600'}`}>{val.length}/{f.maxLength}</span>
                  </div>
                  {f.key === 'bio' ? (
                    <textarea value={val} onChange={(e) => update(f.key, e.target.value)} className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-100 outline-none focus:border-purple-500/50 resize-none h-20" placeholder={f.placeholder} maxLength={f.maxLength} />
                  ) : (
                    <input value={val} onChange={(e) => update(f.key, e.target.value)} className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-100 outline-none focus:border-purple-500/50" placeholder={f.placeholder} maxLength={f.maxLength} {...(f.key === 'phone' ? { type: 'tel', inputMode: 'numeric' as const } : {})} />
                  )}
                </label>
              )})}

              <button type="submit" disabled={saving} className="self-start px-5 h-10 rounded-lg bg-purple-600 text-white text-sm cursor-pointer disabled:opacity-50 hover:bg-purple-500 transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </main>
      </div>

      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  )
}

export default Profile
