import express from 'express'
import path from 'path'



  const router = express.Router()

  router.get('/', (req, res, next) => {
    res.render('login')
  })

  router.post('/', (req, res) => {
    console.log(req.body)

    return res.json(req.body)
  })

export default router