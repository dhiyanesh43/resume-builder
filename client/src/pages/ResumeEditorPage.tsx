import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, X, ZoomIn, ZoomOut, Download, Check, Loader2 } from 'lucide-react'
import { api } from '../lib/api'
import type { Resume, ResumeContent, TemplateId } from '../lib/types'
import { useDebouncedEffect } from '../lib/useDebouncedEffect'
import ResumePreview from '../components/ResumePreview'
import TemplateSwitcher from '../components/TemplateSwitcher'
import AccordionSection from '../components/AccordionSection'

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function ResumeEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState<ResumeContent | null>(null)
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!id) return
    api
      .get<Resume>(`/resumes/${id}`)
      .then((r) => {
        setTitle(r.title)
        setContent(r.content)
      })
      .catch((err) => setError(err.message))
  }, [id])

  async function save(nextTitle: string, nextContent: ResumeContent) {
    if (!id) return
    setStatus('saving')
    try {
      await api.patch(`/resumes/${id}`, { title: nextTitle, content: nextContent })
      setStatus('saved')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to save')
    }
  }

  // Autosave: fires 900ms after the user stops editing, instead of on
  // every keystroke — avoids hammering the API while still feeling instant.
  useDebouncedEffect(
    () => {
      if (content) save(title, content)
    },
    [title, content],
    900
  )

  function handlePrint() {
    window.print()
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="text-sm text-ink-faint">{error || 'Loading…'}</p>
      </div>
    )
  }

  function update<K extends keyof ResumeContent>(key: K, value: ResumeContent[K]) {
    setContent({ ...content!, [key]: value })
  }

  function updatePersonalInfo(field: keyof ResumeContent['personalInfo'], value: string) {
    setContent({ ...content!, personalInfo: { ...content!.personalInfo, [field]: value } })
  }

  return (
    <div className="min-h-screen bg-surface font-sans">
      <header className="border-b border-border bg-card print:hidden sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <Link to="/dashboard" className="text-ink-faint hover:text-ink shrink-0">
              <ArrowLeft size={18} />
            </Link>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[15px] font-semibold text-ink border-none focus:outline-none bg-transparent min-w-0"
            />
          </div>
          <div className="flex items-center gap-4 text-sm shrink-0">
            <SaveIndicator status={status} />
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-primary text-white rounded-xl px-4 py-2 font-medium hover:bg-primary-hover transition-colors"
            >
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {error && <p className="text-sm text-danger px-6 pt-4">{error}</p>}

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 print:block">
        {/* Editor column */}
        <div className="space-y-4 print:hidden">
          <AccordionSection title="Personal info" defaultOpen>
            <Field label="Full name" value={content.personalInfo.fullName} onChange={(v) => updatePersonalInfo('fullName', v)} />
            <Field label="Email" value={content.personalInfo.email} onChange={(v) => updatePersonalInfo('email', v)} />
            <Field label="Phone" value={content.personalInfo.phone || ''} onChange={(v) => updatePersonalInfo('phone', v)} />
            <Field label="Location" value={content.personalInfo.location || ''} onChange={(v) => updatePersonalInfo('location', v)} />
            <TextArea label="Summary" value={content.personalInfo.summary || ''} onChange={(v) => updatePersonalInfo('summary', v)} />
          </AccordionSection>

          <AccordionSection
            title="Experience"
            action={<AddButton onClick={() => update('experience', [...content.experience, { company: '', role: '', startDate: '', endDate: '', description: '' }])} />}
          >
            {content.experience.length === 0 && <EmptyHint text="No experience added yet." />}
            {content.experience.map((exp, i) => (
              <EntryCard key={i} onRemove={() => update('experience', content.experience.filter((_, idx) => idx !== i))}>
                <Field label="Company" value={exp.company} onChange={(v) => updateEntry(content, update, 'experience', i, 'company', v)} />
                <Field label="Role" value={exp.role} onChange={(v) => updateEntry(content, update, 'experience', i, 'role', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start date" value={exp.startDate} onChange={(v) => updateEntry(content, update, 'experience', i, 'startDate', v)} />
                  <Field label="End date" value={exp.endDate || ''} onChange={(v) => updateEntry(content, update, 'experience', i, 'endDate', v)} />
                </div>
                <TextArea label="Description" value={exp.description || ''} onChange={(v) => updateEntry(content, update, 'experience', i, 'description', v)} />
              </EntryCard>
            ))}
          </AccordionSection>

          <AccordionSection
            title="Education"
            action={<AddButton onClick={() => update('education', [...content.education, { school: '', degree: '', startDate: '', endDate: '' }])} />}
          >
            {content.education.length === 0 && <EmptyHint text="No education added yet." />}
            {content.education.map((edu, i) => (
              <EntryCard key={i} onRemove={() => update('education', content.education.filter((_, idx) => idx !== i))}>
                <Field label="School" value={edu.school} onChange={(v) => updateEntry(content, update, 'education', i, 'school', v)} />
                <Field label="Degree" value={edu.degree} onChange={(v) => updateEntry(content, update, 'education', i, 'degree', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start date" value={edu.startDate} onChange={(v) => updateEntry(content, update, 'education', i, 'startDate', v)} />
                  <Field label="End date" value={edu.endDate || ''} onChange={(v) => updateEntry(content, update, 'education', i, 'endDate', v)} />
                </div>
              </EntryCard>
            ))}
          </AccordionSection>

          <AccordionSection
            title="Projects"
            action={<AddButton onClick={() => update('projects', [...content.projects, { name: '', description: '', link: '' }])} />}
          >
            {content.projects.length === 0 && <EmptyHint text="No projects added yet." />}
            {content.projects.map((p, i) => (
              <EntryCard key={i} onRemove={() => update('projects', content.projects.filter((_, idx) => idx !== i))}>
                <Field label="Name" value={p.name} onChange={(v) => updateEntry(content, update, 'projects', i, 'name', v)} />
                <TextArea label="Description" value={p.description || ''} onChange={(v) => updateEntry(content, update, 'projects', i, 'description', v)} />
                <Field label="Link" value={p.link || ''} onChange={(v) => updateEntry(content, update, 'projects', i, 'link', v)} />
              </EntryCard>
            ))}
          </AccordionSection>

          <AccordionSection
            title="Certificates"
            action={<AddButton onClick={() => update('certificates', [...content.certificates, { name: '', issuer: '', date: '' }])} />}
          >
            {content.certificates.length === 0 && <EmptyHint text="No certificates added yet." />}
            {content.certificates.map((c, i) => (
              <EntryCard key={i} onRemove={() => update('certificates', content.certificates.filter((_, idx) => idx !== i))}>
                <Field label="Name" value={c.name} onChange={(v) => updateEntry(content, update, 'certificates', i, 'name', v)} />
                <Field label="Issuer" value={c.issuer || ''} onChange={(v) => updateEntry(content, update, 'certificates', i, 'issuer', v)} />
                <Field label="Date" value={c.date || ''} onChange={(v) => updateEntry(content, update, 'certificates', i, 'date', v)} />
              </EntryCard>
            ))}
          </AccordionSection>

          <AccordionSection title="Skills">
            <TagInput values={content.skills} onChange={(v) => update('skills', v)} placeholder="e.g. TypeScript" />
          </AccordionSection>

          <AccordionSection title="Languages">
            <TagInput values={content.languages} onChange={(v) => update('languages', v)} placeholder="e.g. Spanish" />
          </AccordionSection>

          <AccordionSection title="Interests">
            <TagInput values={content.interests} onChange={(v) => update('interests', v)} placeholder="e.g. Chess" />
          </AccordionSection>

          <AccordionSection title="References">
            <TextArea label="Notes" value={content.references || ''} onChange={(v) => update('references', v)} />
          </AccordionSection>
        </div>

        {/* Preview column */}
        <div className="print:w-full">
          <div className="flex items-center justify-between mb-1 print:hidden">
            <TemplateSwitcher value={content.templateId} onChange={(t: TemplateId) => update('templateId', t)} />
            <div className="flex items-center gap-1 mb-4">
              <button onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))} className="p-1.5 text-ink-faint hover:text-ink">
                <ZoomOut size={15} />
              </button>
              <span className="text-xs text-ink-faint w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))} className="p-1.5 text-ink-faint hover:text-ink">
                <ZoomIn size={15} />
              </button>
            </div>
          </div>
          <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="transition-transform duration-150">
            <ResumePreview content={content} />
          </div>
        </div>
      </main>
    </div>
  )
}

function updateEntry<T extends 'experience' | 'education' | 'projects' | 'certificates'>(
  content: ResumeContent,
  update: <K extends keyof ResumeContent>(key: K, value: ResumeContent[K]) => void,
  key: T,
  index: number,
  field: string,
  value: string
) {
  const list = [...(content[key] as any[])]
  list[index] = { ...list[index], [field]: value }
  update(key, list as any)
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'saving')
    return (
      <span className="flex items-center gap-1.5 text-ink-faint text-xs">
        <Loader2 size={13} className="animate-spin" /> Saving…
      </span>
    )
  if (status === 'saved')
    return (
      <span className="flex items-center gap-1.5 text-accent text-xs">
        <Check size={13} /> Saved
      </span>
    )
  if (status === 'error') return <span className="text-danger text-xs">Save failed</span>
  return null
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
    >
      <Plus size={13} /> Add
    </button>
  )
}

function EmptyHint({ text }: { text: string }) {
  return <p className="text-xs text-ink-faint italic">{text}</p>
}

function EntryCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="border border-border rounded-xl p-4 space-y-2.5 relative bg-surface">
      <button onClick={onRemove} className="absolute top-3 right-3 text-ink-faint hover:text-danger">
        <X size={14} />
      </button>
      {children}
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-ink-soft mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-ink-soft mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}

function TagInput({
  values,
  onChange,
  placeholder,
}: {
  values: string[]
  onChange: (v: string[]) => void
  placeholder: string
}) {
  const [draft, setDraft] = useState('')

  function commit() {
    const v = draft.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setDraft('')
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {values.map((v) => (
          <span key={v} className="flex items-center gap-1 bg-surface border border-border text-xs text-ink px-2.5 py-1 rounded-full">
            {v}
            <button onClick={() => onChange(values.filter((x) => x !== v))} className="text-ink-faint hover:text-danger">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            commit()
          }
        }}
        onBlur={commit}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}
