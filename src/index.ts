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
import { resetSessionForm } from './middlewares/resetSessionForm'
import loginRouter from './routes/login'
import registerRouter from './routes/register'
import rootRouter from './routes/root'

const app = express()

// views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'views'))

// middlewares
app.use(staticProvider)
app.use(checkRefererMiddleware)
app.use(jsonParser)
app.use(urlencodedParser)
app.use(session)
app.use(resetSessionForm)

// routes
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/', rootRouter)

// global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    return console.error(err)
  }
  next()
})

// start server
const port = process.env.APP_PORT
app.listen(port, () => {
  console.log(`express listening at ${port}`)
})
