import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'

function bootstrap() {
  const app: Express = express()

  dotenv.config()

  const port = process.env.PORT || 3000

  app.use(cors())
  app.use(compression())
  app.use(helmet())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/static', express.static('public'))

  app.get('/', (_req: Request, res: Response) => {
    res.sendStatus(200)
  })

  // For invalid routes
  app.get('*', (_req: Request, res: Response) => {
    res.sendStatus(404)
  })

  app.listen(port, () => {
    console.log(`[server]: 🚀 Application is running on: http://localhost:${port}`)
  })
}

bootstrap()
