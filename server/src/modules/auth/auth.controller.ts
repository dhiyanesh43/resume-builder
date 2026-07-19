import { Request, Response, NextFunction } from 'express'
import { registerSchema, loginSchema } from './auth.schema'
import { registerUser, loginUser } from './auth.service'

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: parsed.error.issues[0].message, code: 'VALIDATION_ERROR' },
      })
    }

    const { name, email, password } = parsed.data
    const result = await registerUser(name, email, password)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: { message: parsed.error.issues[0].message, code: 'VALIDATION_ERROR' },
      })
    }

    const { email, password } = parsed.data
    const result = await loginUser(email, password)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}
