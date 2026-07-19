import type { ResumeContent } from '../../lib/types'

export default function ModernTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo, experience, education, skills, projects, certificates, languages, interests } = content

  return (
    <div className="font-sans text-[#14141f] text-[13px] leading-relaxed">
      <div className="border-b-2 border-[#3730a3] pb-4 mb-5">
        <h1 className="text-[26px] font-bold tracking-tight">{personalInfo.fullName || 'Your name'}</h1>
        <p className="text-[12px] text-[#5b5d70] mt-1">
          {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('  ·  ')}
        </p>
      </div>

      {personalInfo.summary && <p className="mb-5 text-[#33334a]">{personalInfo.summary}</p>}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-semibold">
                <span>{exp.role || 'Role'} — {exp.company || 'Company'}</span>
                <span className="text-[#5b5d70] font-normal text-[11px]">{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              {exp.description && <p className="text-[#33334a] mt-0.5">{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <div key={i} className="mb-2">
              <span className="font-semibold">{p.name}</span>
              {p.description && <p className="text-[#33334a]">{p.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} className="flex justify-between mb-1.5">
              <span className="font-semibold">{edu.degree} — {edu.school}</span>
              <span className="text-[#5b5d70] text-[11px]">{edu.startDate} – {edu.endDate || 'Present'}</span>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p>{skills.join('  ·  ')}</p>
        </Section>
      )}

      {certificates.length > 0 && (
        <Section title="Certificates">
          <p>{certificates.map((c) => c.name).join('  ·  ')}</p>
        </Section>
      )}

      {languages.length > 0 && (
        <Section title="Languages">
          <p>{languages.join('  ·  ')}</p>
        </Section>
      )}

      {interests.length > 0 && (
        <Section title="Interests">
          <p>{interests.join('  ·  ')}</p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#3730a3] mb-2">{title}</h2>
      {children}
    </div>
  )
}
