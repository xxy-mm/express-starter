import { RequestHandler } from 'express'
import SessionForm from '../models/sessionForm'

const sessionFormMiddleware: RequestHandler = (req, res, next) => {
  req.session!.form = SessionForm.create()
  next()
}

export default sessionFormMiddleware
