import { Router } from 'express'
import {
  checkIsBefore,
  checkIsDate,
  checkIsNumber,
  checkLength,
  checkNotEmpty,
  checkSessionToken,
} from '../middlewares/checkFormFields'
import PageFormData from '../models/pageFormData'
import { toFormDate } from '../utils/date'
import { setFormToken } from '../utils/setFormToken'

const router = Router()

router.get('/', (req, res) => {
  res.render('account-list')
})

router.get('/new', (req, res) => {
  const form = new PageFormData({ createdAt: toFormDate(new Date()) }, {})
  setFormToken(req, form)
  res.render('createAccount', form)
})

router.post(
  '/',
  checkSessionToken('token'),
  checkNotEmpty('amount'),
  checkNotEmpty('details'),
  checkNotEmpty('createdAt'),
  checkIsNumber('amount'),
  checkLength('details', { min: 1, max: 200 }),
  checkIsDate('createdAt'),
  checkIsBefore('createdAt'),
  (req, res) => {
    const form: PageFormData = req.session!.form
    if (form.hasError) {
      setFormToken(req, form)
      res.render('createAccount', form)
      return
    }
    res.json(req.body)
  },
)

router.put('/:id', (req, res) => {
  res.send('update account')
})

router.delete('/:id', (req, res) => {
  res.send('delete account')
})

export default router
