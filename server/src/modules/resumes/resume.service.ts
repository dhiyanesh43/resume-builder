import { prisma } from '../../config/prisma'
import { ResumeContent } from './resume.schema'

function notFound() {
  const err: any = new Error('Resume not found')
  err.status = 404
  err.code = 'RESUME_NOT_FOUND'
  return err
}

export async function listResumes(userId: string) {
  const resumes = await prisma.resume.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  })
  return resumes.map(serializeResume)
}

export async function getResume(userId: string, resumeId: string) {
  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
  if (!resume) throw notFound()
  return serializeResume(resume)
}

export async function createResume(userId: string, title: string, content: ResumeContent) {
  const resume = await prisma.resume.create({
    data: { userId, title, content: JSON.stringify(content) },
  })
  return serializeResume(resume)
}

export async function updateResume(
  userId: string,
  resumeId: string,
  updates: { title?: string; content?: ResumeContent }
) {
  // We scope the find to userId as well as id — this is what stops
  // User A from ever editing User B's resume, even if they guess the id.
  const existing = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
  if (!existing) throw notFound()

  const resume = await prisma.resume.update({
    where: { id: resumeId },
    data: {
      ...(updates.title ? { title: updates.title } : {}),
      ...(updates.content ? { content: JSON.stringify(updates.content) } : {}),
    },
  })
  return serializeResume(resume)
}

export async function deleteResume(userId: string, resumeId: string) {
  const existing = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
  if (!existing) throw notFound()

  await prisma.resume.delete({ where: { id: resumeId } })
}

export async function duplicateResume(userId: string, resumeId: string) {
  const existing = await prisma.resume.findFirst({ where: { id: resumeId, userId } })
  if (!existing) throw notFound()

  const copy = await prisma.resume.create({
    data: {
      userId,
      title: `${existing.title} (copy)`,
      content: existing.content,
    },
  })
  return serializeResume(copy)
}

// Converts the stored content string back into a real object before
// sending it to the client — the database stores it as text (SQLite
// has no native JSON column type), but the API always returns real JSON.
function serializeResume(resume: { id: string; title: string; content: string; createdAt: Date; updatedAt: Date }) {
  return {
    id: resume.id,
    title: resume.title,
    content: JSON.parse(resume.content),
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  }
}
