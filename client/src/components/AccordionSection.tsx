import { useState } from 'react'
import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export default function AccordionSection({
  title,
  defaultOpen = false,
  action,
  children,
}: {
  title: string
  defaultOpen?: boolean
  action?: ReactNode
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="bg-card border border-border rounded-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-ink">{title}</span>
        <div className="flex items-center gap-3">
          {action && <span onClick={(e) => e.stopPropagation()}>{action}</span>}
          <ChevronDown
            size={16}
            className={`text-ink-faint transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 space-y-3">{children}</div>
        </div>
      </div>
    </div>
  )
}
