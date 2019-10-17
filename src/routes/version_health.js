import express from 'express'
import { httpStatus } from '../constants'

const router = express.Router()

// Version Route
router.get('/version', (req, res, next) => {
  const version = process.env.npm_package_version
  return res.json({ statusCode: httpStatus.OK, message: 'OK', data: { version } })
})

// Health check route
router.get('/health-check', (req, res, next) => {
  return res.json({ statusCode: httpStatus.OK, message: 'OK' })
})

export default router
