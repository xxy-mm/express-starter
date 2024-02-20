import { Router } from 'express'

import {
  checkEmail,
  checkLength,
  checkSessionToken,
  checkUserExists,
} from '../middlewares/checkFormFields'
import sessionFormMiddleware from '../middlewares/sessionFormMiddleware'
import SessionForm from '../models/sessionForm'
import renderPage from '../utils/renderPage'

const router = Router()

router.get('/', sessionFormMiddleware, (req, res, next) => {
  if (req.session?.user?._id) {
    return res.redirect('/accounts')
  }
  const form: SessionForm = req.session!.form
  form.addSessionToken(req.session)
  renderPage('login', { form, title: 'Login' })(res.render, req.session)
})

router.post(
  '/',
  sessionFormMiddleware,
  checkSessionToken('token'),
  checkEmail('email'),
  checkLength('password', { min: 6, max: 20 }),
  checkUserExists('email'),
  async (req, res) => {
    const form: SessionForm = req.session!.form
    if (form.hasError) {
      form.addSessionToken(req.session)
      renderPage('login', { form })(res.render, req.session)
      return
    }
    res.redirect('/')
  },
)

export default router
