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
import sessionFormMiddleware from '../middlewares/sessionFormMiddleware'
import SessionForm from '../models/sessionForm'
import renderPage from '../utils/renderPage'

const router = Router()

// list

router.get('/', async (req, res) => {
  const list = await listAccount({
    _id: req.session!.user._id,
    skip: 0,
    limit: 10,
  })

  renderPage('accountList', { list, title: 'Accounts' })(req, res)
})

// create

router.get('/new', sessionFormMiddleware, (req, res) => {
  const form: SessionForm = req.session!.form
  form.addSessionToken(req.session)
  renderPage('createOrUpdateAccount', {
    form,
    isNew: true,
    title: 'Add account',
  })(req, res)
})

router.post(
  '/new',
  sessionFormMiddleware,
  checkSessionToken('token'),
  checkNotEmpty('amount'),
  checkNotEmpty('details'),
  checkNotEmpty('date'),
  checkIsNumber('amount'),
  checkLength('details', { min: 1, max: 200 }),
  checkIsDate('date'),
  checkIsBefore('date'),
  (req, res) => {
    const form: SessionForm = req.session!.form
    if (form.hasError) {
      form.addSessionToken(req.session)
      renderPage('createOrUpdateAccount', { form })(req, res)
      return
    }
    // invalid form token from session
    form.complete(req.session!)
    const { date, amount, details } = req.body
    const user = req.session!.user._id as string
    createAccount({
      user,
      date,
      amount,
      details,
    })
      .then(() => {
        return res.redirect('/accounts')
      })
      .catch((err) => {
        return res.render('error', { message: err.message })
      })
  },
)

// edit

router.get('/edit/:id', async (req, res) => {
  const account = await findAccountById(req.params.id)
  if (account == null) {
    return res.render('error', { message: '404 not found' })
  }

  const form = SessionForm.create({
    ...account,
    _id: account._id.toString(),
    user: account.user.toString(),
  }).addSessionToken(req.session)

  renderPage('createOrUpdateAccount', {
    form,
    title: 'Edit Account',
    isNew: false,
  })(req, res)
})

router.post(
  '/edit',
  sessionFormMiddleware,
  checkSessionToken('token'),
  checkNotEmpty('_id'),
  checkIsNumber('amount'),
  checkLength('details', { min: 10, max: 200 }),
  async (req, res) => {
    const form: SessionForm = req.session!.form
    if (form.hasError) {
      form.addSessionToken(req.session)
      renderPage('createOrUpdateAccount', { form, isNew: false })(req, res)
      return
    }
    form.complete(req.session)
    const updated = await updateAccount({
      _id: req.body._id,
      amount: req.body.amount,
      details: req.body.details,
    })
      .then(() => {
        res.redirect('/accounts')
      })
      .catch((error) => {
        renderPage('error', { message: error.message })(req, res.status(500))
      })
  },
)
// delete

router.get('/delete/:id', async (req, res) => {
  const deleted = await deleteAccount(req.params.id)
  if (deleted.modifiedCount === 1) {
    renderPage('success', { message: 'delete success', redirect: '/accounts' })(
      req,
      res.status(200),
    )
    return
  }

  renderPage('error', { message: 'delete failed', redirect: '/accounts' })(
    req,
    res,
  )
})

export default router
