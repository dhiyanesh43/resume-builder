import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './modules/auth/auth.routes'
import resumeRoutes from './modules/resumes/resume.routes'
import { errorHandler } from './middleware/errorHandler'

export function createApp() {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
      credentials: true,
    })
  )
  app.use(morgan('dev'))
  app.use(express.json())

  app.get('/api/v1/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } })
  })

  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/resumes', resumeRoutes)

  app.use((_req, res) => {
    res.status(404).json({ success: false, error: { message: 'Route not found', code: 'NOT_FOUND' } })
  })

  app.use(errorHandler)

  return app
}
