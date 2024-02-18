import express from 'express'
import { createUser } from '../db/models/UserModel'
import {
  checkEmail,
  checkEmailAvailable,
  checkLength,
  checkSessionToken,
} from '../middlewares/checkFormFields'
import PageFormData from '../models/pageFormData'
import randomToken from '../utils/randomToken'
import { setFormToken } from '../utils/setFormToken'

const router = express.Router()

router.get('/', (req, res) => {
  const token = randomToken()
  const form = new PageFormData({ token })
  req.session!.token = token
  res.render('register', form)
})

router.post(
  '/',
  checkSessionToken('token'),
  checkEmail('email'),
  checkLength('password'),
  checkEmailAvailable('email'),
  async (req, res) => {
    let { email, password } = req.body
    const form = req.session!.form as PageFormData

    if (form.hasError) {
      // form has errors, generate new token, and resend the form.
      setFormToken(req, form)
      return res.render('register', form)
    }

    createUser({ email, password })
      .then(() => {
        // form submitted, remove form token from session since we won't send the form anymore.
        req.session!.token = null
      })
      .then(() => {
        // redirect to homepage
        res.redirect('/')
      })
      .catch((err) => {
        res.status(500).render('error', err)
      })
  },
)

export default router
