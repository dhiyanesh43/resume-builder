import { Router } from 'express'
import { requireAuth } from '../../middleware/auth'
import { list, getOne, create, update, remove, duplicate } from './resume.controller'

const router = Router()

router.use(requireAuth)

router.get('/', list)
router.get('/:id', getOne)
router.post('/', create)
router.post('/:id/duplicate', duplicate)
router.patch('/:id', update)
router.delete('/:id', remove)

export default router
