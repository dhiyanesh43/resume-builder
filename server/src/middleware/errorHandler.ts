import { Request, Response, NextFunction } from 'express'

// Catches any error thrown or passed via next(err) in any route,
// so we never leak stack traces to the client and always respond
// in our standard { success, error } envelope.
export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)

  const status = err.status || 500
  const message = status === 500 ? 'Something went wrong' : err.message

  res.status(status).json({
    success: false,
    error: { message, code: err.code || 'INTERNAL_ERROR' },
  })
}
