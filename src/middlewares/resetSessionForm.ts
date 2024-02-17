import { RequestHandler } from 'express'
import PageFormData from '../models/pageFormData'

export const resetSessionForm: RequestHandler = (req, res, next) => {
  req.session!.form = new PageFormData()
  next()
}
