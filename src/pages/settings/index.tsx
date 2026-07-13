import { useState, useEffect, useRef, type FormEvent } from 'react'
import { useLocale } from '../../locales'
import Breadcrumb from '../../components/breadcrumb'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Table from '../../components/table'
import Modal from '../../components/modal'
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  type Tag,
} from '../../modules/tags/api'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from '../../modules/categories/api'
import Pagination from '../../components/pagination'
import Toast from '../../components/toast'

interface Props {
  navigate: (path: string) => void
}

type Tab = 'tags' | 'categories'

function Settings({ navigate }: Props) {
  const { t } = useLocale()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('tags')
  const [page, setPage] = useState(1)
  const PER_PAGE = 20



  // data
  const [tags, setTags] = useState<Tag[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')

  // modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<{ id: number; name: string; type: Tab } | null>(null)
  const [formName, setFormName] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  // delete confirm
  const [deleting, setDeleting] = useState<{ id: number; name: string; type: Tab } | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  // toast
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>({ show: false, type: 'success', message: '' })

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ show: true, type, message })
  }

  async function fetchData() {
    setFetching(true)
    setFetchError('')
    try {
      const [t, c] = await Promise.all([getTags(), getCategories()])
      setTags(t)
      setCategories(c)
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setFetching(false)
    }
  }

  const fetched = useRef(false)
  useEffect(() => { if (fetched.current) return; fetched.current = true; fetchData() }, [])

  // open create modal
  function openCreate() {
    setEditing(null)
    setFormName('')
    setFormError('')
    setModalOpen(true)
  }

  // open edit modal
  function openEdit(id: number, name: string, type: Tab) {
    setEditing({ id, name, type })
    setFormName(name)
    setFormError('')
    setModalOpen(true)
  }

  // submit create/edit
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!formName.trim()) {
      setFormError('Name is required')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      if (editing) {
        if (editing.type === 'tags') {
          await updateTag(editing.id, formName.trim())
          setTags((prev) => prev.map((t) => t.id === editing.id ? { ...t, name: formName.trim() } : t))
        } else {
          await updateCategory(editing.id, formName.trim())
          setCategories((prev) => prev.map((c) => c.id === editing.id ? { ...c, name: formName.trim() } : c))
        }
      } else {
        if (tab === 'tags') {
          const created = await createTag(formName.trim())
          setTags((prev) => [...prev, created])
        } else {
          const created = await createCategory(formName.trim())
          setCategories((prev) => [...prev, created])
        }
      }
      setModalOpen(false)
      showToast('success', editing ? t.toast.updated : t.toast.created)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed')
    } finally {
      setSaving(false)
    }
  }

  // delete
  async function confirmDelete() {
    if (!deleting) return
    setDeletingLoading(true)
    try {
      if (deleting.type === 'tags') {
        await deleteTag(deleting.id)
        setTags((prev) => prev.filter((t) => t.id !== deleting.id))
      } else {
        await deleteCategory(deleting.id)
        setCategories((prev) => prev.filter((c) => c.id !== deleting.id))
      }
      setDeleting(null)
      showToast('success', t.toast.deleted)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : t.toast.failed)
    } finally {
      setDeletingLoading(false)
    }
  }

  // sort
  const [sortKey, setSortKey] = useState<string | null>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc')
      } else {
        setSortKey(null)
        setSortDir('asc')
      }
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const activeData = (tab === 'tags' ? tags : categories).slice().sort((a, b) => {
    if (!sortKey) return 0
    const aMap = a as unknown as Record<string, unknown>
    const bMap = b as unknown as Record<string, unknown>
    const valA = aMap[sortKey]
    const valB = bMap[sortKey]
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDir === 'asc' ? valA - valB : valB - valA
    }
    const strA = String(valA ?? '').toLowerCase()
    const strB = String(valB ?? '').toLowerCase()
    return sortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
  })

  const totalItems = activeData.length
  const pagedData = activeData.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const tabBtn = (key: Tab, label: string) => (
    <button
      onClick={() => { setTab(key); setPage(1) }}
      className={`px-1 py-2 text-sm capitalize cursor-pointer transition-colors border-b-2 ${
        tab === key
          ? 'border-purple-400 text-purple-300 font-medium'
          : 'border-transparent text-zinc-400 hover:text-zinc-200'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-col h-screen">
      <Header variant="dashboard" navigate={navigate} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPath="/dashboard/settings" navigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-6 md:p-8 flex flex-col gap-5 overflow-y-auto">
          <Breadcrumb items={[{ label: t.dashboard.title, path: '/dashboard' }, { label: t.sidebar.settings }]} navigate={navigate} />

          <div className="flex gap-2 mb-0">
            {tabBtn('tags', t.sidebar.tags)}
            {tabBtn('categories', t.sidebar.categories)}
          </div>

          {fetching ? (
            <p className="text-zinc-500 text-sm">Loading...</p>
          ) : fetchError ? (
            <p className="text-pink-400 text-sm">{fetchError}</p>
          ) : (
            <>
              <div className="flex justify-between items-center -mt-1">
                <h1 className="text-lg md:text-xl font-semibold text-white">{tab === 'tags' ? t.sidebar.tagSettings : t.sidebar.categorySettings}</h1>
                <button onClick={openCreate} className="flex items-center gap-1.5 px-3 h-10 rounded-lg bg-purple-600 text-white text-xs cursor-pointer hover:bg-purple-500 transition-colors">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t.table.create} {tab === 'tags' ? t.sidebar.tags : t.sidebar.categories}
                </button>
              </div>

              <Table
                data={pagedData}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={handleSort}
                columns={[
                  { key: '#', label: '#', className: 'w-10 text-center bg-white/[.02]', cellClassName: 'text-zinc-500 text-center bg-white/[.02]', render: (_item, i) => (page - 1) * PER_PAGE + i + 1 },
                  { key: 'id', label: t.table.id, className: 'hidden' },
                  { key: 'name', label: tab === 'tags' ? t.table.tagName : t.table.categoryName, sortable: true, className: 'bg-white/[.02]' },
                  {
                    key: 'actions',
                    label: t.table.actions,
                    className: 'w-28 bg-white/[.02]',
                    render: (item) => (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(item.id, item.name, tab)}
                          className="flex items-center justify-center w-7 h-7 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[.04] cursor-pointer transition-colors" title="Edit">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button
                          onClick={() => setDeleting({ id: item.id, name: item.name, type: tab })}
                          className="flex items-center justify-center w-7 h-7 rounded text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 cursor-pointer transition-colors" title="Delete">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
              <Pagination current={page} total={totalItems} perPage={PER_PAGE} onChange={setPage} />
            </>
          )}
        </main>
      </div>

      {/* Create / Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? t.table.edit : t.table.create}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            {t.table.name}
            <input
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-100 outline-none focus:border-purple-500/50"
              placeholder={t.table.name}
              autoFocus
            />
          </label>
          {formError && <p className="text-pink-400 text-xs">{formError}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-1.5 rounded-lg text-sm text-zinc-400 cursor-pointer hover:bg-white/5">{t.table.cancel}</button>
            <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-sm cursor-pointer disabled:opacity-50 hover:bg-purple-500">
              {saving ? t.table.saving : t.table.save}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title={t.table.delete}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-300">
            {t.table.confirmDelete} <strong className="text-white">&quot;{deleting?.name}&quot;</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <button onClick={() => setDeleting(null)} className="px-4 py-1.5 rounded-lg text-sm text-zinc-400 cursor-pointer hover:bg-white/5">{t.table.cancel}</button>
            <button onClick={confirmDelete} disabled={deletingLoading} className="px-4 py-1.5 rounded-lg bg-pink-600 text-white text-sm cursor-pointer disabled:opacity-50 hover:bg-pink-500">
              {deletingLoading ? t.table.deleting : t.table.delete}
            </button>
          </div>
        </div>
      </Modal>

      <Toast show={toast.show} type={toast.type} message={toast.message} onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  )
}

export default Settings
