import { NextFunction, Request, Response } from 'express'
import UserModel from '../db/models/UserModel'

const checkLogin =
  (checkFn: (...args: any) => any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await checkFn(req, res, next)
    if (!result) {
      res.status(403).redirect('/login')
      return
    }
    next()
  }

async function checkLoginFn(req: Request) {
  req.session!.user = req.session?.user ?? {}
  const { email, password } = req.session?.user

  let user: unknown

  return (
    email != null &&
    password != null &&
    (user = await UserModel.findOne({ email, password }).exec()) != null
  )
}

export default checkLogin(checkLoginFn)
