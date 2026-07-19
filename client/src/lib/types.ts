export interface User {
  id: string
  name: string
  email: string
}

export interface ExperienceEntry {
  company: string
  role: string
  startDate: string
  endDate?: string
  description?: string
}

export interface EducationEntry {
  school: string
  degree: string
  startDate: string
  endDate?: string
}

export interface ProjectEntry {
  name: string
  description?: string
  link?: string
}

export interface CertificateEntry {
  name: string
  issuer?: string
  date?: string
}

export type TemplateId = 'modern' | 'minimal' | 'executive'

export interface ResumeContent {
  personalInfo: {
    fullName: string
    email: string
    phone?: string
    location?: string
    summary?: string
  }
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: string[]
  projects: ProjectEntry[]
  certificates: CertificateEntry[]
  languages: string[]
  interests: string[]
  references?: string
  templateId: TemplateId
}

export interface Resume {
  id: string
  title: string
  content: ResumeContent
  createdAt: string
  updatedAt: string
}

export const emptyResumeContent: ResumeContent = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  interests: [],
  references: '',
  templateId: 'modern',
}

export const TEMPLATES: { id: TemplateId; name: string; description: string }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean sans-serif, subtle accent rule, ATS-friendly.' },
  { id: 'minimal', name: 'Minimal', description: 'Maximum white space, understated typography.' },
  { id: 'executive', name: 'Executive', description: 'Serif headline, structured two-tone layout.' },
]
