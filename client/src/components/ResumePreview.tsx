import type { ResumeContent } from '../lib/types'
import ModernTemplate from './templates/ModernTemplate'
import MinimalTemplate from './templates/MinimalTemplate'
import ExecutiveTemplate from './templates/ExecutiveTemplate'

export default function ResumePreview({ content }: { content: ResumeContent }) {
  return (
    <div
      id="resume-preview"
      className="bg-white text-[#14141f] p-10 w-full aspect-[8.5/11] max-w-[8.5in] mx-auto shadow-[0_1px_3px_rgba(0,0,0,0.1)] overflow-hidden"
    >
      {content.templateId === 'minimal' && <MinimalTemplate content={content} />}
      {content.templateId === 'executive' && <ExecutiveTemplate content={content} />}
      {(content.templateId === 'modern' || !content.templateId) && <ModernTemplate content={content} />}
    </div>
  )
}
