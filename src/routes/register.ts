import express from 'express'
import { createUser } from '../db/models/UserModel'
import {
  checkEmail,
  checkEmailAvailable,
  checkLength,
  checkSessionToken,
} from '../middlewares/checkFormFields'
import sessionFormMiddleware from '../middlewares/sessionFormMiddleware'
import SessionForm from '../models/sessionForm'
import renderPage from '../utils/renderPage'
import { setUserSession } from '../utils/setUserSession'

const router = express.Router()

router.get('/', sessionFormMiddleware, (req, res) => {
  const form: SessionForm = req.session?.form
  form.addSessionToken(req.session)
  renderPage('register', { form, title: 'Register' })(req, res)
})

router.post(
  '/',
  sessionFormMiddleware,
  checkSessionToken('token'),
  checkEmail('email'),
  checkLength('password'),
  checkEmailAvailable('email'),
  async (req, res) => {
    let { email, password } = req.body
    const form: SessionForm = req.session!.form

    if (form.hasError) {
      // form has errors, generate new token, and resend the form.
      form.addSessionToken(req.session)
      renderPage('register', { form })(req, res.status(400))
      return
    }
    // form submitted, remove form token from session since we won't send the form anymore.
    form.complete(req.session!)
    createUser({ email, password })
      .then((result) => {
        setUserSession(
          {
            _id: result._id.toString(),
            password: result.password,
          },
          req.session!,
        )
      })
      .then(() => {
        res.redirect('/')
      })
      .catch((err) => {
        renderPage('error', { message: err.message })(req, res)
      })
  },
)

export default router
