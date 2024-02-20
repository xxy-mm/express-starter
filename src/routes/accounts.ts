import { Router } from 'express'
import {
  createAccount,
  deleteAccount,
  findAccountById,
  listAccount,
  updateAccount,
} from '../db/models/AccountModel'
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

// list

router.get('/', async (req, res) => {
  const list = await listAccount({
    _id: req.session!.user._id,
    skip: 0,
    limit: 10,
  })

  res.render('accountList', { list })
})

// create

router.get('/new', (req, res) => {
  const form = new PageFormData({ createdAt: toFormDate(new Date()) }, {})
  setFormToken(req, form)
  res.render('createOrUpdateAccount', { form, isNew: true })
})

router.post(
  '/new',
  checkSessionToken('token'),
  checkNotEmpty('amount'),
  checkNotEmpty('details'),
  checkNotEmpty('date'),
  checkIsNumber('amount'),
  checkLength('details', { min: 1, max: 200 }),
  checkIsDate('date'),
  checkIsBefore('date'),
  (req, res) => {
    const form: PageFormData = req.session!.form
    if (form.hasError) {
      setFormToken(req, form)
      res.render('createOrUpdateAccount', form)
      return
    }
    // invalid form token from session
    req.session!.token = null
    const { date, amount, details } = req.body
    const user = req.session!.user._id as string
    createAccount({
      user,
      date,
      amount,
      details,
    })
      .then((result) => {
        return res.redirect('/accounts')
      })
      .catch((err) => {
        return res.render('error', err)
      })
  },
)

// edit

router.get('/edit/:id', async (req, res) => {
  const account = await findAccountById(req.params.id)
  if (account == null) {
    return res.render('error', { message: '404 not found' })
  }

  const form = new PageFormData()
  form.values = {
    ...account,
    _id: account._id.toString(),
    user: account.user.toString(),
  }
  setFormToken(req, form)
  res.render('createOrUpdateAccount', { form, isNew: false })
})

router.post(
  '/edit',
  checkSessionToken('token'),
  checkNotEmpty('_id'),
  checkIsNumber('amount'),
  checkLength('details', { min: 10, max: 200 }),
  async (req, res) => {
    const form = req.session!.form
    if (form.hasError) {
      setFormToken(req, form)
      res.render('createOrUpdateAccount', { form, isNew: false })
      return
    }
    const updated = await updateAccount({
      _id: req.body._id,
      amount: req.body.amount,
      details: req.body.details,
    }).then((result) => {
      req.session!.token = null
      res.redirect('/accounts')
    })
  },
)
// delete

router.get('/delete/:id', async (req, res) => {
  const deleted = await deleteAccount(req.params.id)
  if (deleted.modifiedCount === 1) {
    return res.status(200).render('success', {
      message: 'delete success',
      backUrl: '/accounts',
    })
  }
  return res
    .status(400)
    .render('error', { message: 'delete failed', backUrl: '/accounts' })
})

export default router
