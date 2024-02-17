import { NextFunction, Request, Response } from 'express'
import UserModel from '../db/models/UserModel'

async function checkLogin(req: Request, res: Response, next: NextFunction) {
  const email = req.session?.email
  const password = req.session?.password
  const user = await UserModel.findOne({ email, password }).exec()
  if (!user) {
    res.status(403).redirect('login')
    return
  }
  next()
}

export default checkLogin
