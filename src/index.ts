import dayjs from 'dayjs'
import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import './config'
import './db'
import {
  checkRefererMiddleware,
  jsonParser,
  session,
  staticProvider,
  urlencodedParser,
} from './middlewares'
import checkLogin from './middlewares/checkLogin'
import sessionForm from './middlewares/resetSessionForm'
import accountsRouter from './routes/accounts'
import loginRouter from './routes/login'
import registerRouter from './routes/register'
import rootRouter from './routes/root'
const app = express()

// views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'views'))
app.locals.dayjs = dayjs

// middlewares
app.use(staticProvider)
app.use(checkRefererMiddleware)
app.use(jsonParser)
app.use(urlencodedParser)
app.use(session)
app.use(sessionForm)

// routes
app.use('/', rootRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/accounts', checkLogin, accountsRouter)

// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status(500).render('error', err)
  }
  next()
})

// start server
const port = process.env.APP_PORT
app.listen(port, () => {
  console.log(`express listening at ${port}`)
})
