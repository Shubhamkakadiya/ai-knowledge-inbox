import cors from 'cors'
import express from 'express'
import './db.js'
import { config } from './config.js'
import { logger } from './logger.js'
import { asyncHandler } from './middleware/asyncHandler.js'
import { errorHandler } from './middleware/errorHandler.js'
import { ingestRouter } from './routes/ingest.js'
import { itemsRouter } from './routes/items.js'
import { queryRouter } from './routes/query.js'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json({ limit: '1mb' }))

app.use((req, _res, next) => {
  logger.info('request received', { method: req.method, path: req.path })
  next()
})

app.get(
  '/health',
  asyncHandler(async (_req, res) => {
    res.json({ status: 'ok' })
  })
)

app.use('/ingest', ingestRouter)
app.use('/items', itemsRouter)
app.use('/query', queryRouter)

app.use((req, res) => {
  res.status(404).json({ error: { message: `No route for ${req.method} ${req.path}` } })
})

app.use(errorHandler)

app.listen(config.port, () => {
  logger.info('server started', { port: config.port })
})
