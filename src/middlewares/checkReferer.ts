import { NextFunction, Request, Response } from 'express'

export const checkRefererMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const referer = req.get('referer')
  if (referer) {
    const url = new URL(referer)
    const host = url.hostname
    if (host !== 'localhost') {
      res.status(404).send(`<h1>404 Not Found</h1>`)
      return
    }
  }
  next()
}
