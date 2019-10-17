import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'express-jwt'
import { Routes } from './routes'
import { connectMongo, errorHandler, JWT_CONFIG, CORS } from './config'
import { decryptMiddleware } from './utils'

// Initiate express
const app = express()

const corsOptions = {
  origin: CORS.ORIGINS,
  methods: CORS.METHODS,
  optionsSuccessStatus: 200
}
app.use(cors(CORS.ORIGINS === '*' ? undefined : corsOptions))
// Parse incoming request body
app.use(bodyParser.json({ limit: '5mb' }))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 50 }))
app.use(decryptMiddleware)
app.use(jwt({ secret: JWT_CONFIG.SECERET }).unless({ path: JWT_CONFIG.NO_AUTH_PATHS }))

// Create MongoDB connection
connectMongo()

// Initiate all routes
Routes(app)

// Application level error handler
app.use(errorHandler)
export { app }
