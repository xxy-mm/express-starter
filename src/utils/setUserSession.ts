import { MD5 } from 'crypto-js'
import { Request } from 'express'
export const setUserSession = (req: Request) => {
  let { email, password } = req.body
  password = MD5(password)
  req.session!.email = email
  req.session!.password = password
}
