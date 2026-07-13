import { useState, useEffect, useRef } from 'react'
import { useLocale } from '../../locales'
import Breadcrumb from '../../components/breadcrumb'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import { createPost } from '../../modules/posts/api'
import { getCategories, type Category } from '../../modules/categories/api'
import { getTags, type Tag } from '../../modules/tags/api'
import { removeToken } from '../../modules/auth'
import RichEditor from '../../components/rich-editor'
import MultiSelect from '../../components/multi-select'
import Toast from '../../components/toast'
import { ENV } from '../../constants/env'

interface Props {
  navigate: (path: string) => void
}

function CreatePost({ navigate }: Props) {
  const { t } = useLocale()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)
  const [body, setBody] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState<'draft' | 'publish' | null>(null)
  const [error, setError] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>(
    { show: false, type: 'success', message: '' }
  )

  function handleLogout() {
    removeToken()
    navigate('/login')
  }

  const fetched = useRef(false)
  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    Promise.all([getCategories(), getTags()])
      .then(([cats, ts]) => { setCategories(cats); setTags(ts) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function slugify(val: string) {
    return val.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slugEdited) setSlug(slugify(val))
  }

  function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImageFile(null)
    setImagePreview(null)
    if (imageRef.current) imageRef.current.value = ''
  }

  async function save(status: 'draft' | 'published') {
    if (!title.trim()) { setError(t.posts.titleRequired); return }
    setSaving(status === 'draft' ? 'draft' : 'publish')
    setError('')
    try {
      let imageURL = ''
      if (imageFile) {
        const fd = new FormData()
        fd.append('file', imageFile)
        const res = await fetch(`${ENV.API_URL}/api/v1/upload?dir=post-cover`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` },
          body: fd,
        })
        if (!res.ok) throw new Error(t.posts.imageUploadFailed)
        const data = await res.json()
        imageURL = data.url
      }

      await createPost({
        title: title.trim(),
        slug: slug || undefined,
        body,
        image_url: imageURL || undefined,
        categories: selectedCategories.join(','),
        tags: selectedTags.join(','),
        status,
      })
      setToast({ show: true, type: 'success', message: status === 'draft' ? t.posts.savedDraft : t.posts.published })
      setTimeout(() => navigate('/dashboard/posts'), 1000)
    } catch (err) {
      setToast({ show: true, type: 'error', message: err instanceof Error ? err.message : t.posts.failed })
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header variant="dashboard" navigate={navigate} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPath="/dashboard/posts" navigate={navigate} onLogout={handleLogout}
          open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Breadcrumb items={[
            { label: t.dashboard.title, path: '/dashboard' },
            { label: t.sidebar.posts, path: '/dashboard/posts' },
            { label: t.posts.create },
          ]} navigate={navigate} />

          {loading ? (
            <p className="text-zinc-500 text-sm mt-6">{t.posts.loading}</p>
          ) : (
            <div className="mt-6 max-w-5xl flex flex-col gap-5">
              <div className="flex flex-col gap-1 text-sm text-zinc-400">
                <span>{t.posts.coverImage}</span>
                <div className="flex items-start gap-3">
                  {imagePreview ? (
                    <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                      <img src={imagePreview} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={removeImage}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer hover:bg-black/80 text-xs">
                        &times;
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => imageRef.current?.click()}
                      className="w-48 h-28 rounded-lg border border-dashed border-white/10 text-zinc-500 text-xs cursor-pointer hover:border-white/20 hover:text-zinc-400 transition-colors flex flex-col items-center justify-center gap-1 flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      {t.posts.uploadCover}
                    </button>
                  )}
                  <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <label className="flex flex-col gap-1 text-sm text-zinc-400 flex-1">
                  <span>{t.posts.title} <span className="text-red-400">*</span></span>
                  <input value={title} onChange={(e) => handleTitleChange(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-100 outline-none focus:border-purple-500/50"
                    placeholder={t.posts.titlePlaceholder} autoFocus />
                </label>
                <label className="flex flex-col gap-1 text-sm text-zinc-400 flex-1">
                  {t.posts.slug}
                  <input value={slug} onChange={(e) => { setSlug(e.target.value); setSlugEdited(true) }}
                    className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-100 outline-none focus:border-purple-500/50"
                    placeholder={t.posts.slugPlaceholder} />
                </label>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex flex-col gap-1 text-sm text-zinc-400 flex-1">
                  <span>{t.posts.categories}</span>
                  <MultiSelect options={categories} selected={selectedCategories} onChange={setSelectedCategories} placeholder={t.posts.selectCategories} />
                </div>
                <div className="flex flex-col gap-1 text-sm text-zinc-400 flex-1">
                  <span>{t.posts.tags}</span>
                  <MultiSelect options={tags} selected={selectedTags} onChange={setSelectedTags} placeholder={t.posts.selectTags} />
                </div>
              </div>

              <label className="flex flex-col gap-1 text-sm text-zinc-400">
                {t.posts.body}
                <RichEditor value={body} onChange={setBody} />
              </label>

              {error && <p className="text-pink-400 text-xs">{error}</p>}

              <div className="flex gap-2">
                <button type="button" onClick={() => navigate('/dashboard/posts')}
                  className="px-5 h-10 rounded-lg text-sm text-zinc-400 cursor-pointer hover:bg-white/5 transition-colors">
                  {t.posts.cancel}
                </button>
                <button type="button" onClick={() => save('draft')} disabled={!!saving}
                  className="px-5 h-10 rounded-lg border border-white/10 text-zinc-300 text-sm cursor-pointer disabled:opacity-50 hover:bg-white/5 transition-colors">
                  {saving === 'draft' ? t.posts.saving : t.posts.saveDraft}
                </button>
                <button type="button" onClick={() => save('published')} disabled={!!saving}
                  className="px-5 h-10 rounded-lg bg-purple-600 text-white text-sm cursor-pointer disabled:opacity-50 hover:bg-purple-500 transition-colors">
                  {saving === 'publish' ? t.posts.publishing : t.posts.publish}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Toast show={toast.show} type={toast.type} message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  )
}

export default CreatePost
