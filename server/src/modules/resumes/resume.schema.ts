import { z } from 'zod'

const experienceEntry = z.object({
  company: z.string().default(''),
  role: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().optional(),
  description: z.string().optional(),
})

const educationEntry = z.object({
  school: z.string().default(''),
  degree: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().optional(),
})

const projectEntry = z.object({
  name: z.string().default(''),
  description: z.string().optional(),
  link: z.string().optional(),
})

const certificateEntry = z.object({
  name: z.string().default(''),
  issuer: z.string().optional(),
  date: z.string().optional(),
})

export const resumeContentSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().default(''),
    // Empty string is valid here (a fresh resume starts blank) — we only
    // enforce email *format* once the user has actually typed something.
    // This was the root cause of "New Resume" silently failing: an empty
    // string used to be rejected by z.string().email().
    email: z.union([z.literal(''), z.string().email('Invalid email')]).default(''),
    phone: z.string().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
  }),
  experience: z.array(experienceEntry).default([]),
  education: z.array(educationEntry).default([]),
  skills: z.array(z.string()).default([]),
  projects: z.array(projectEntry).default([]),
  certificates: z.array(certificateEntry).default([]),
  languages: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  references: z.string().optional(),
  templateId: z.string().default('modern'),
})

export const createResumeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: resumeContentSchema,
})

export const updateResumeSchema = z.object({
  title: z.string().min(1).optional(),
  content: resumeContentSchema.optional(),
})

export type ResumeContent = z.infer<typeof resumeContentSchema>
