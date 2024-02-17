import { MD5 } from 'crypto-js'
import express from 'express'
import UserModel from '../db/models/UserModel'
import {
  checkEmail,
  checkEmailAvailable,
  checkPassword,
  checkSessionToken,
} from '../middlewares/checkFormFields'
import PageFormData from '../models/pageFormData'
import randomToken from '../utils/randomToken'

const router = express.Router()

router.get('/', (req, res) => {
  const token = randomToken()
  const form = new PageFormData({ token })
  req.session!.token = token
  res.render('register', form)
})

router.post(
  '/',
  checkSessionToken,
  checkEmail,
  checkPassword,
  checkEmailAvailable,
  async (req, res) => {
    let { email, password } = req.body
    const form = req.session!.form as PageFormData

    if (form.hasError) {
      const token = randomToken()
      req.session!.token = token
      form.values.token = token
      return res.render('register', form)
    }
    password = MD5(password)
    UserModel.create({
      email,
      password,
    })
      .then(() => {
        req.session!.token = null
      })
      .then(() => {
        req.session!.email = email
        req.session!.password = password
        res.redirect('/')
      })
      .catch((err) => {
        res.status(500).render('500', { errors: err })
      })
  },
)

export default router
