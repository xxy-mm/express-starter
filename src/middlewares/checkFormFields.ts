import { MD5 } from 'crypto-js'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import isEmail from 'validator/lib/isEmail'
import UserModel from '../db/models/UserModel'
import PageFormData from '../models/pageFormData'

/**
 * in order to prevent repeated form submitting, we create a hidden form field named 'token'
 * this token is also stored in session.token
 * when a form is submitted, we should always check wether the token value of the form matches session.token
 * a mismatch indicates the form is either malicious or expired
 */
export const checkSessionToken = checkFormField(
  'token',
  async (req) => {
    const { token } = req.body
    const sessionToken = req.session!.token
    return sessionToken === token
  },
  'invalid token',
  (req, res) => {
    res.status(400).render('error', { message: 'Invalid form' })
  },
)

export const checkUserExists = checkFormField(
  'email',
  async (req) => {
    let { email, password } = req.body
    password = MD5(password)
    const user = await UserModel.findOne({ email, password })
    return user != null
  },
  'Incorrect email or password',
)

/**
 * check whether the email format is correct
 */
export const checkEmail: RequestHandler = checkFormField(
  'email',
  async (req) => isEmail(req.body.email),
  'Invalid email',
)
/**
 * check whether the email is available for use.
 * if not, store the state in session, and continue executing next handler.
 */
export const checkEmailAvailable = checkFormField(
  'email',
  async (req: Request) => {
    const { email } = req.body
    const found = await UserModel.findOne({ email }).exec()
    return found == null
  },
  'Email already in use',
)

export const checkPassword: RequestHandler = checkFormField(
  'password',
  async (req) => {
    const length = (req.body.password ?? '').trim().length
    return length >= 6 && length <= 20
  },
  'Password should be at least 6 and no more than 20 characters',
)

function checkFormField(
  field: string,
  checkFunction: (req: Request) => Promise<boolean>,
  error?: string,
  onError?: RequestHandler,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let value = req.body[field]
    const result = await checkFunction(req)
    const form = setPageFormData(field, value, result ? undefined : error)
    req.session!.form = mergePageFormData(req.session!.form, form)
    if (!result) {
      if (onError) {
        onError(req, res, next)
        return
      }
    }
    next()
  }
}

function setPageFormData(field: string, value: any, errorMsg?: string) {
  return new PageFormData(
    {
      [field]: value,
    },
    errorMsg
      ? {
          [field]: errorMsg,
        }
      : {},
  )
}

function mergePageFormData(object: PageFormData, source: PageFormData) {
  object.values = { ...object.values, ...source.values }
  object.errors = { ...object.errors, ...source.errors }
  return object
}
