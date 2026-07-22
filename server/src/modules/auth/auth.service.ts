import bcrypt from 'bcryptjs'
import { prisma } from '../../config/prisma'
import { signAccessToken } from '../../config/jwt'

const SALT_ROUNDS = 12

export async function registerUser(name: string, email: string, password: string) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const err: any = new Error('An account with this email already exists')
    err.status = 400
    err.code = 'EMAIL_TAKEN'
    throw err
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  })

  const token = signAccessToken({ userId: user.id, email: user.email })
  return { token, user: { id: user.id, name: user.name, email: user.email } }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    const err: any = new Error('Invalid email or password')
    err.status = 401
    err.code = 'INVALID_CREDENTIALS'
    throw err
  }

  const matches = await bcrypt.compare(password, user.passwordHash)
  if (!matches) {
    const err: any = new Error('Invalid email or password')
    err.status = 401
    err.code = 'INVALID_CREDENTIALS'
    throw err
  }

  const token = signAccessToken({ userId: user.id, email: user.email })
  return { token, user: { id: user.id, name: user.name, email: user.email } }
}
