import './config'
import express, { Request, Response, NextFunction } from 'express'
import path from 'path'
import { checkRefererMiddleware, jsonParser, staticProvider, urlencodedParser } from './middlewares'
import loginRouter from './routes/login'
import rootRouter from './routes/root'
import registerRouter from './routes/register'

const app = express()
const port = process.env.APP_PORT

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '..', 'views'))

app.use(staticProvider)
app.use(checkRefererMiddleware)
app.use(jsonParser)
app.use(urlencodedParser)

app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/', rootRouter)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err) {
    return console.error(err)
  }
  next()
})
app.listen(port, () => {
  console.log(`express listening at ${port}`)
})
