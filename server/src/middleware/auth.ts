import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../config/jwt'

export interface AuthedRequest extends Request {
  user?: { userId: string; email: string }
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Missing or malformed Authorization header', code: 'NO_TOKEN' },
    })
  }

  const token = header.split(' ')[1]

  try {
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token', code: 'INVALID_TOKEN' },
    })
  }
}
