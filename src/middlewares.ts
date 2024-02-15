import bodyParser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'

const staticDir = path.resolve(__dirname, '..', 'public')

export const staticProvider = express.static(staticDir)

export const urlencodedParser = bodyParser.urlencoded({ extended: false })
export const jsonParser = bodyParser.json()
export const rawParser = bodyParser.raw()
export const textParser = bodyParser.text()

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
