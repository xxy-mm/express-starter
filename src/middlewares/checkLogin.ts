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
  const { password, _id } = req.session?.user

  if (_id && password) {
    const found = await UserModel.findOne({ _id, password }).exec()
    console.log('user', found)

    return found != null
  }
  return false
}

export default checkLogin(checkLoginFn)
