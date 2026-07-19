import { PrismaClient } from '@prisma/client'

// A single shared Prisma instance for the whole app, instead of creating
// a new database connection every time we need one.
export const prisma = new PrismaClient()
