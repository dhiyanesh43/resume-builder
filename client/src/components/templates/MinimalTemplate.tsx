import type { ResumeContent } from '../../lib/types'

export default function MinimalTemplate({ content }: { content: ResumeContent }) {
  const { personalInfo, experience, education, skills, projects, certificates, languages, interests } = content

  return (
    <div className="font-sans text-[#14141f] text-[13px] leading-loose px-2">
      <h1 className="text-[22px] font-medium tracking-tight mb-1">{personalInfo.fullName || 'Your name'}</h1>
      <p className="text-[11px] text-[#9294a6] mb-8 tracking-wide">
        {[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join('   ')}
      </p>

      {personalInfo.summary && <p className="mb-8 text-[#5b5d70] max-w-lg">{personalInfo.summary}</p>}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <p className="font-medium">{exp.role || 'Role'}</p>
              <p className="text-[#9294a6] text-[11px] mb-1">
                {exp.company} · {exp.startDate} – {exp.endDate || 'Present'}
              </p>
              {exp.description && <p className="text-[#5b5d70]">{exp.description}</p>}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <p key={i} className="mb-2">
              <span className="font-medium">{p.name}</span>
              {p.description && <span className="text-[#5b5d70]"> — {p.description}</span>}
            </p>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <p key={i} className="mb-2">
              <span className="font-medium">{edu.degree}</span>
              <span className="text-[#9294a6]"> · {edu.school} · {edu.startDate}–{edu.endDate || 'Present'}</span>
            </p>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p className="text-[#5b5d70]">{skills.join('   ')}</p>
        </Section>
      )}

      {(certificates.length > 0 || languages.length > 0 || interests.length > 0) && (
        <Section title="More">
          <p className="text-[#5b5d70] space-y-1">
            {certificates.length > 0 && <span className="block">Certificates: {certificates.map((c) => c.name).join(', ')}</span>}
            {languages.length > 0 && <span className="block">Languages: {languages.join(', ')}</span>}
            {interests.length > 0 && <span className="block">Interests: {interests.join(', ')}</span>}
          </p>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-[10px] uppercase tracking-[0.2em] text-[#9294a6] mb-3">{title}</h2>
      {children}
    </div>
  )
}
