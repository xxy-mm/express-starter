import cookieSession from 'cookie-session'

const defaultKeys = 'key1,key2'
const name = process.env.APP_SESSION_NAME
const keys = (process.env.APP_SESSION_KEYS ?? defaultKeys).split(',')
const maxAge = Number(process.env.APP_SESSION_EXPIRE)
export const session = cookieSession({
  name,
  keys,
  maxAge,
  httpOnly: true,
})
