import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  req.session = null
  res.status(200).redirect('/login')
})

export default router
