import { Request, Response } from 'express'
import SessionForm from '../models/sessionForm'

interface RenderPageOptions {
  // the page's title rendered in <title> element, can also be used somewhere in our page
  title?: string
  // user from session
  user?: { _id: string; password: string }
  // for pages which have a form
  form?: SessionForm
  // for error pages
  message?: string
  // If the page has a `<a>` or `<button>` used for redirecting, this is the url
  redirect?: string
  // usually an update and an create page are most the same, so they can share the same template, this prop can be used in the page
  // to perform different actions
  isNew?: boolean
  [prop: string]: any
}

const renderPage =
  (view: string, options: RenderPageOptions) =>
  (req: Request, res: Response) => {
    res.render(view, { ...options, user: req.session!.user }, (err, html) => {
      if (err) {
        console.error(err)
      }
      res.send(html)
    })
  }

export default renderPage
