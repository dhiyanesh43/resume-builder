import { TEMPLATES } from '../lib/types'
import type { TemplateId } from '../lib/types'

export default function TemplateSwitcher({
  value,
  onChange,
}: {
  value: TemplateId
  onChange: (id: TemplateId) => void
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          title={t.description}
          className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
            value === t.id
              ? 'bg-primary text-white border-primary'
              : 'bg-card text-ink-soft border-border hover:border-primary/40'
          }`}
        >
          {t.name}
        </button>
      ))}
    </div>
  )
}
