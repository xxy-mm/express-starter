import { Router } from 'express'

import {
  checkEmail,
  checkLength,
  checkSessionToken,
  checkUserExists,
} from '../middlewares/checkFormFields'
import PageFormData from '../models/pageFormData'
import { setFormToken } from '../utils/setFormToken'

const router = Router()

router.get('/', (req, res, next) => {
  const form = new PageFormData({})
  setFormToken(req, form)
  res.render('login', form)
})

router.post(
  '/',
  checkSessionToken('token'),
  checkEmail('email'),
  checkLength('password', { min: 6, max: 20 }),
  checkUserExists('email'),
  async (req, res) => {
    const form: PageFormData = req.session!.form
    if (form.hasError) {
      setFormToken(req, form)
      res.render('login', form)
      return
    }
    // since we've already set session.user in the checkUserExists middleware, we don't need to set again here.
    // setUserSession(...)
    res.redirect('/')
  },
)

export default router
