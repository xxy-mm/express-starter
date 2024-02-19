import { NextFunction, Request, RequestHandler, Response } from 'express'
import { isDate, isEmail, isEmpty, isLength } from 'validator'
import { checkUserLogin, findUserByEmail } from '../db/models/UserModel'
import PageFormData from '../models/pageFormData'
import { setUserSession } from '../utils/setUserSession'

/**
 * in order to prevent repeated form submitting, we create a hidden form field named 'token'
 * this token is also stored in session.token
 * when a form is submitted, we should always check wether the token value of the form matches session.token
 * a mismatch indicates the form is either malicious or expired
 */
export const checkSessionToken = checkFormField(
  async (req, token) => {
    const sessionToken = req!.session!.token
    return sessionToken === token
  },
  'invalid token',
  (req, res) => {
    res.status(400).render('error', { message: 'Invalid form' })
  },
)

export const checkIsBefore = checkFormField(async (req, value, opts) => {
  return new Date(value).getDate() <= new Date().getDate()
}, 'Date should before now')

export const checkIsDate = checkFormField(async (req, value, opts) => {
  return isDate(value, opts)
}, 'Invalid Date')

export const checkIsNumber = checkFormField(
  async (req, value, opts) => {
    return !isNaN(+value)
  },
  (field) => `${field} should be a valid decimal`,
)

export const checkNotEmpty = checkFormField(
  async (req, value) => {
    return !isEmpty(value)
  },
  (field) => `${field} can't be empty`,
)

export const checkUserExists = checkFormField(async (req) => {
  const user = await checkUserLogin({
    email: req.body.email,
    password: req.body.password,
  })
  // for now this method is only called as a middleware in the login route.
  // we can set the found/login user into session here to avoid querying for the user information again
  user && setUserSession(req, user)
  return user != null
}, 'Incorrect email or password')

/**
 * check whether the email format is correct
 */
export const checkEmail = checkFormField(
  async (req, email, opts) => isEmail(email, opts),
  'Invalid email',
)
/**
 * check whether the email is available for use.
 * if not, store the state in session, and continue executing next handler.
 */
export const checkEmailAvailable = checkFormField(async (req, email) => {
  const found = findUserByEmail(email)
  return found == null
}, 'Email already in use')

export const checkLength = checkFormField(
  async (req, value, opts) => isLength(value, opts),
  (field) => `${field} should be at least 6 and no more than 20 characters`,
)

export function checkFormField<T = string, K = Record<string, any>>(
  checkFunction: (
    req: Request,
    value: T,
    validatorOptions?: K,
  ) => Promise<boolean>,
  error?: string | ((field: string) => string),
  onError?: RequestHandler,
) {
  return (field: string, validatorOptions?: K) =>
    async (req: Request, res: Response, next: NextFunction) => {
      let value: T = req.body[field]
      const result = await checkFunction(req, value, validatorOptions)
      const form = setPageFormData(
        field,
        value,
        result ? undefined : typeof error === 'function' ? error(field) : error,
      )
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
