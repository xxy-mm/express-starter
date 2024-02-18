import { RequestHandler } from 'express'
import PageFormData from '../models/pageFormData'

const sessionForm: RequestHandler = (req, res, next) => {
  req.session!.form = new PageFormData()
  next()
}

export default sessionForm
