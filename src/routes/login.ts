import { Router } from 'express'

import {
  checkEmail,
  checkPassword,
  checkSessionToken,
  checkUserExists,
} from '../middlewares/checkFormFields'
import PageFormData from '../models/pageFormData'
import randomToken from '../utils/randomToken'
import { setFormToken } from '../utils/setFormToken'

const router = Router()

router.get('/', (req, res, next) => {
  const token = randomToken()
  const form = new PageFormData({ token })
  req.session!.token = token
  res.render('login', form)
})

router.post(
  '/',
  checkSessionToken,
  checkEmail,
  checkPassword,
  checkUserExists,
  async (req, res) => {
    const form: PageFormData = req.session!.form
    if (form.hasError) {
      setFormToken(req, form)
      res.render('login', form)
      return
    }
    res.send('home page')
  },
)

export default router
