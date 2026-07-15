import { useState, useEffect, useRef } from 'react'
import { useLocale } from '../../locales'
import Breadcrumb from '../../components/breadcrumb'
import Sidebar from '../../components/sidebar'
import Header from '../../components/header'
import Table from '../../components/table'
import Modal from '../../components/modal'
import Button from '../../components/button'
import { getPosts, deletePost } from '../../modules/posts/api'
import type { Post } from '../../modules/posts/api'
import Pagination from '../../components/pagination'
import Toast from '../../components/toast'

interface Props {
  navigate: (path: string) => void
}

function Posts({ navigate }: Props) {
  const { t } = useLocale()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    document.title = t.posts.documentTitle
  }, [t])
  const [fetching, setFetching] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 20

  // delete confirm
  const [deleting, setDeleting] = useState<Post | null>(null)
  const [deletingLoading, setDeletingLoading] = useState(false)

  // toast
  const [toast, setToast] = useState<{ show: boolean; type: 'success' | 'error'; message: string }>(
    { show: false, type: 'success', message: '' }
  )

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ show: true, type, message })
  }

  async function fetchData() {
    setFetching(true)
    setFetchError('')
    try {
      const data = await getPosts()
      setPosts(data || [])
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : t.posts.failed)
    } finally {
      setFetching(false)
    }
  }

  const fetched = useRef(false)
  useEffect(() => { if (fetched.current) return; fetched.current = true; fetchData() }, [])

  const [sortKey, setSortKey] = useState<string | null>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  function handleSort(key: string) {
    if (sortKey === key) {
      if (sortDir === 'asc') { setSortDir('desc') }
      else { setSortKey(null); setSortDir('asc') }
    } else { setSortKey(key); setSortDir('asc') }
  }

  const sorted = posts.slice().sort((a, b) => {
    if (!sortKey) return 0
    const aMap = a as unknown as Record<string, unknown>
    const bMap = b as unknown as Record<string, unknown>
    const valA = aMap[sortKey]; const valB = bMap[sortKey]
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDir === 'asc' ? valA - valB : valB - valA
    }
    const strA = String(valA ?? '').toLowerCase(); const strB = String(valB ?? '').toLowerCase()
    return sortDir === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA)
  })

  const totalItems = sorted.length
  const pagedData = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function formatDate(dateStr: string | null) {
    if (!dateStr) return '\u2014'
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }) + ' ' +
      d.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })
  }

  async function confirmDelete() {
    if (!deleting) return
    setDeletingLoading(true)
    try {
      await deletePost(deleting.id)
      setPosts((prev) => prev.filter((p) => p.id !== deleting.id))
      setDeleting(null)
      showToast('success', t.toast.deleted)
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : t.toast.failed)
    } finally {
      setDeletingLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Header variant="dashboard" navigate={navigate} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPath="/dashboard/posts" navigate={navigate} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-5 overflow-y-auto">
          <Breadcrumb items={[{ label: t.dashboard.title, path: '/dashboard' }, { label: t.sidebar.posts }]}
            navigate={navigate} />

          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-zinc-500 text-sm">{t.posts.loading}</p>
            </div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-pink-400 text-sm">{fetchError}</p>
              <Button variant="outline" size="sm" onClick={fetchData}>
                {t.posts.retry}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-lg md:text-xl font-semibold text-white">{t.sidebar.posts}</h1>
                <Button variant="primary" size="lg" onClick={() => navigate('/dashboard/posts/create')}>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t.posts.createPost}
                </Button>
              </div>

              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-white/10 rounded-lg">
                  <svg className="w-12 h-12 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                  <p className="text-zinc-500 text-sm">{t.posts.noPostsYet}</p>
                  <Button variant="primary" size="lg" onClick={() => navigate('/dashboard/posts/create')}>
                    {t.posts.createFirstPost}
                  </Button>
                </div>
              ) : (
                <>
                  <Table
                    data={pagedData}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                    columns={[
                      {
                        key: '#', label: '#', className: 'w-12 text-center bg-white/[.02]',
                        cellClassName: 'text-zinc-500 text-center bg-white/[.02]',
                        render: (_item, i) => (page - 1) * PER_PAGE + i + 1,
                      },
                      {
                        key: 'title', label: t.posts.postName, sortable: true, className: 'bg-white/[.02]',
                        cellClassName: 'max-w-[250px] truncate',
                        render: (item) => item.title
                          ? <a href={`/${item.slug}`} target="_blank" rel="noopener noreferrer"
                              className="text-purple-300 hover:text-purple-200 underline underline-offset-2 cursor-pointer">{item.title}</a>
                          : '\u2014',
                      },
                      {
                        key: 'slug', label: t.posts.slug, sortable: true, className: 'bg-white/[.02]',
                        cellClassName: 'max-w-[200px] truncate',
                        render: (item) => item.slug || '\u2014',
                      },
                      {
                        key: 'category_names', label: t.posts.category, className: 'bg-white/[.02]',
                        render: (item) => item.category_names || '\u2014',
                      },
                      {
                        key: 'created_by_name', label: t.posts.createdBy, sortable: true, className: 'bg-white/[.02]',
                        render: (item) => item.created_by_name || '\u2014',
                      },
                      {
                        key: 'created_at', label: t.posts.createdAt, sortable: true,
                        className: 'whitespace-nowrap bg-white/[.02]',
                        render: (item) => formatDate(item.created_at),
                      },
                      {
                        key: 'updated_at', label: t.posts.updatedAt, sortable: true,
                        className: 'whitespace-nowrap bg-white/[.02]',
                        render: (item) => formatDate(item.updated_at),
                      },
                      {
                        key: 'status', label: t.posts.status, sortable: true,
                        className: 'w-24 bg-white/[.02]',
                        render: (item) => (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.status === 'published'
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : item.status === 'draft'
                              ? 'bg-yellow-500/15 text-yellow-300'
                              : 'bg-zinc-500/15 text-zinc-400'
                          }`}>
                            {item.status || '\u2014'}
                          </span>
                        ),
                      },
                      {
                        key: 'actions', label: t.table.actions, className: 'w-28 bg-white/[.02]',
                        render: (item) => (
                          <div className="flex items-center gap-1">
                            <button onClick={() => navigate(`/dashboard/posts/edit/${item.id}`)}
                              className="flex items-center justify-center w-7 h-7 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/[.04] cursor-pointer transition-colors" title="Edit">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button onClick={() => setDeleting(item)}
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
            </>
          )}
        </main>
      </div>

      {/* Delete Confirm */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title={t.table.delete}>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-zinc-300">
            {t.table.confirmDelete} <strong className="text-white">&quot;{deleting?.title}&quot;</strong>?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleting(null)}>
              {t.table.cancel}
            </Button>
            <Button variant="primary" color="danger" size="sm" onClick={confirmDelete} loading={deletingLoading}>
              {deletingLoading ? t.table.deleting : t.table.delete}
            </Button>
          </div>
        </div>
      </Modal>

      <Toast show={toast.show} type={toast.type} message={toast.message}
        onClose={() => setToast((t) => ({ ...t, show: false }))} />
    </div>
  )
}

export default Posts
