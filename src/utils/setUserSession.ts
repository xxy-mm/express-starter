import { Request } from 'express'
export const setUserSession = (
  req: Request,
  user: { _id: string; password: string },
) => {
  req.session!.user = user
}
