import type { NextFunction, Request, Response } from 'express'
import { logger } from '../logger.js'

export class AppError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
  }
}

// keep this last in the middleware chain so every thrown/rejected error lands here
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    logger.warn('request failed', { path: req.path, status: err.statusCode, message: err.message })
    res.status(err.statusCode).json({ error: { message: err.message } })
    return
  }

  const message = err instanceof Error ? err.message : 'Unexpected error'
  logger.error('unhandled error', { path: req.path, message })
  res.status(500).json({ error: { message: 'Internal server error' } })
}
