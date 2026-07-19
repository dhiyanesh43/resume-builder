import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, FileText, Copy, Trash2, Clock } from 'lucide-react'
import { api } from '../lib/api'
import type { Resume } from '../lib/types'
import { emptyResumeContent } from '../lib/types'
import Sidebar from '../components/Sidebar'
import Skeleton from '../components/Skeleton'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [resumes, setResumes] = useState<Resume[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    api
      .get<Resume[]>('/resumes')
      .then(setResumes)
      .catch((err) => setError(err.message))
  }, [])

  const filtered = useMemo(() => {
    if (!resumes) return null
    if (!query.trim()) return resumes
    return resumes.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
  }, [resumes, query])

  async function handleCreate() {
    setCreating(true)
    setError(null)
    try {
      const resume = await api.post<Resume>('/resumes', {
        title: 'Untitled resume',
        content: emptyResumeContent,
      })
      navigate(`/resumes/${resume.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create resume')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this resume? This cannot be undone.')) return
    await api.delete(`/resumes/${id}`)
    setResumes((prev) => prev?.filter((r) => r.id !== id) ?? null)
  }

  async function handleDuplicate(id: string) {
    const copy = await api.post<Resume>(`/resumes/${id}/duplicate`)
    setResumes((prev) => (prev ? [copy, ...prev] : [copy]))
  }

  const stats = [
    { label: 'Total resumes', value: resumes?.length ?? '—' },
    {
      label: 'Updated this week',
      value:
        resumes?.filter((r) => Date.now() - new Date(r.updatedAt).getTime() < 7 * 86400000).length ?? '—',
    },
    { label: 'Templates available', value: 3 },
  ]

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      <Sidebar />

      <main className="flex-1 px-10 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">Your resumes</h1>
            <p className="text-sm text-ink-soft mt-0.5">Pick up where you left off, or start something new.</p>
          </div>
          <button
            onClick={handleCreate}
            disabled={creating}
            className="flex items-center gap-2 bg-primary text-white text-sm font-medium rounded-xl px-4 py-2.5 hover:bg-primary-hover transition-colors disabled:opacity-50 shadow-sm"
          >
            <Plus size={16} />
            {creating ? 'Creating…' : 'New resume'}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-card p-5">
              <p className="text-2xl font-semibold text-ink">{s.value}</p>
              <p className="text-xs text-ink-soft mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resumes…"
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-card text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {error && <p className="text-sm text-danger mb-4">{error}</p>}

        {/* Loading skeletons */}
        {filtered === null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-card p-5">
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered?.length === 0 && (
          <div className="flex flex-col items-center text-center py-20 border border-dashed border-border rounded-card bg-card">
            <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center mb-4">
              <FileText size={22} className="text-ink-faint" />
            </div>
            <p className="text-sm font-medium text-ink mb-1">
              {query ? 'No resumes match your search' : "You don't have any resumes yet"}
            </p>
            <p className="text-sm text-ink-soft mb-4">
              {query ? 'Try a different search term.' : 'Create your first one to get started.'}
            </p>
            {!query && (
              <button onClick={handleCreate} className="text-sm text-primary font-medium underline underline-offset-4">
                Create your first resume
              </button>
            )}
          </div>
        )}

        {/* Resume grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered?.map((resume) => (
            <div
              key={resume.id}
              className="group bg-card border border-border rounded-card p-5 hover:border-primary/40 hover:shadow-md transition-all"
            >
              <Link to={`/resumes/${resume.id}`} className="block">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <FileText size={16} className="text-primary" />
                </div>
                <h3 className="font-medium text-ink mb-1 truncate">{resume.title}</h3>
                <p className="text-xs text-ink-faint flex items-center gap-1">
                  <Clock size={11} />
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </Link>
              <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDuplicate(resume.id)}
                  className="flex items-center gap-1 text-xs text-ink-soft hover:text-ink"
                >
                  <Copy size={12} /> Duplicate
                </button>
                <button
                  onClick={() => handleDelete(resume.id)}
                  className="flex items-center gap-1 text-xs text-danger hover:text-danger/80"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
