import SessionForm from '../models/sessionForm'

interface RenderPageOptions {
  // the page's title rendered in <title> element, can also be used somewhere in our page
  title?: string
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
  (renderFn: (...args: any[]) => any, session?: Record<string, any> | null) => {
    renderFn(view, { ...options, user: session?.user })
  }

export default renderPage
