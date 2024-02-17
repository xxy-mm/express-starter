import { Request } from 'express'
import PageFormData from '../models/pageFormData'
import randomToken from './randomToken'

export const setFormToken = (
  req: Request,
  form: PageFormData,
): PageFormData => {
  const token = randomToken()
  req.session!.token = token
  form.values.token = token
  return form
}
