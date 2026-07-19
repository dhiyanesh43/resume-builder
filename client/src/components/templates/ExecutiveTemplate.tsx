import type { ResumeContent } from '../../lib/types'

export default function ExecutiveTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo, experience, education, skills, projects, certificates, languages, interests } = content

  return (
    <div className="font-sans text-[13px] leading-relaxed grid grid-cols-[1fr_1.6fr] gap-6">
      {/* Sidebar */}
      <div className="bg-[#0f1631] text-white rounded-lg p-5 -m-2">
        <h1 className="font-serif text-[20px] font-semibold leading-tight">{personalInfo.fullName || 'Your name'}</h1>
        <p className="text-[11px] text-white/60 mt-3 space-y-1">
          {personalInfo.email && <span className="block">{personalInfo.email}</span>}
          {personalInfo.phone && <span className="block">{personalInfo.phone}</span>}
          {personalInfo.location && <span className="block">{personalInfo.location}</span>}
        </p>

        {skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Skills</h2>
            <p className="text-[11px] text-white/85 leading-relaxed">{skills.join(', ')}</p>
          </div>
        )}

        {languages.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Languages</h2>
            <p className="text-[11px] text-white/85">{languages.join(', ')}</p>
          </div>
        )}

        {certificates.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Certificates</h2>
            <p className="text-[11px] text-white/85">{certificates.map((c) => c.name).join(', ')}</p>
          </div>
        )}

        {interests.length > 0 && (
          <div className="mt-5">
            <h2 className="text-[10px] uppercase tracking-widest text-white/50 mb-2">Interests</h2>
            <p className="text-[11px] text-white/85">{interests.join(', ')}</p>
          </div>
        )}
      </div>

      {/* Main column */}
      <div className="text-[#14141f] pt-1">
        {personalInfo.summary && (
          <p className="mb-5 text-[#33334a] italic font-serif text-[14px]">{personalInfo.summary}</p>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between font-semibold">
                  <span>{exp.role || 'Role'}, {exp.company || 'Company'}</span>
                  <span className="text-[#9294a6] font-normal text-[11px]">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                {exp.description && <p className="text-[#5b5d70] mt-0.5">{exp.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p, i) => (
              <div key={i} className="mb-2">
                <span className="font-semibold">{p.name}</span>
                {p.description && <p className="text-[#5b5d70]">{p.description}</p>}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between mb-1.5">
                <span className="font-semibold">{edu.degree}, {edu.school}</span>
                <span className="text-[#9294a6] text-[11px]">{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="font-serif text-[13px] font-semibold text-[#0f1631] border-b border-[#e6e7ee] pb-1 mb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}
