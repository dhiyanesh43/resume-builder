import { Response, NextFunction } from 'express'
import { AuthedRequest } from '../../middleware/auth'
import { createResumeSchema, updateResumeSchema } from './resume.schema'
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from './resume.service'

export async function list(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const resumes = await listResumes(req.user!.userId)
    res.json({ success: true, data: resumes })
  } catch (err) {
    next(err)
  }
}

export async function getOne(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const resume = await getResume(req.user!.userId, req.params.id)
    res.json({ success: true, data: resume })
  } catch (err) {
    next(err)
  }
}

export async function create(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = createResumeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: parsed.error.issues[0].message, code: 'VALIDATION_ERROR' },
      })
    }
    const resume = await createResume(req.user!.userId, parsed.data.title, parsed.data.content)
    res.status(201).json({ success: true, data: resume })
  } catch (err) {
    next(err)
  }
}

export async function update(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const parsed = updateResumeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: parsed.error.issues[0].message, code: 'VALIDATION_ERROR' },
      })
    }
    const resume = await updateResume(req.user!.userId, req.params.id, parsed.data)
    res.json({ success: true, data: resume })
  } catch (err) {
    next(err)
  }
}

export async function remove(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    await deleteResume(req.user!.userId, req.params.id)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export async function duplicate(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const resume = await duplicateResume(req.user!.userId, req.params.id)
    res.status(201).json({ success: true, data: resume })
  } catch (err) {
    next(err)
  }
}
