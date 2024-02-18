import { Request } from 'express'
export const setUserSession = (
  req: Request,
  user: { email: string; password: string },
) => {
  req.session!.user = user
}
