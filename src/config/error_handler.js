import debug from 'debug'
import { httpStatus } from '../constants'

const log = debug('app:error')

export const errorHandler = (err, req, res, next) => {
  debug.enabled('app:error') || debug.enable('app:error')
  log(req.originalUrl)
  log(err)

  if (err.name === 'AppError') return res.status(err.status || 500).json({ error: err.message })

  // Default handle error
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message || 'Something broke !' })
}
