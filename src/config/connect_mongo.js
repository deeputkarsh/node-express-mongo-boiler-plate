import mongoose from 'mongoose'
import debug from 'debug'
import fs from 'fs'
import { MONGO_CONFIG } from './environment'

const log = debug('app:mongo')

mongoose.Promise = Promise

mongoose.connection.on('connected', () => {
  log('Connection Established')
})

mongoose.connection.on('reconnected', () => {
  log('Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
  log('Connection Disconnected')
})

mongoose.connection.on('close', () => {
  log('Connection Closed')
})

mongoose.connection.on('error', (error) => {
  log('ERROR: ' + error)
  process.exit(1)
})

mongoose.set('debug', MONGO_CONFIG.DEBUG)

const connectMongo = async () => {
  const connectionuri = MONGO_CONFIG.URI
  let sslOptions = {}

  if (MONGO_CONFIG.SSl_CA && MONGO_CONFIG.SSl_CERT && MONGO_CONFIG.SSl_KEY) {
    const ca = [fs.readFileSync(MONGO_CONFIG.SSl_CA)]
    const cert = fs.readFileSync(MONGO_CONFIG.SSl_CERT)
    const key = fs.readFileSync(MONGO_CONFIG.SSl_KEY)
    sslOptions = {
      ssl: true,
      sslValidate: true,
      sslCA: ca,
      sslKey: key,
      sslCert: cert
    }
  }
  const options = {
    ...sslOptions,
    useUnifiedTopology: true,
    autoReconnect: true,
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  }

  log(connectionuri)
  await mongoose.connect(connectionuri, options).catch(error => {
    log('ERROR connecting to mongo: ' + error)
    process.exit(1)
  })
}

export { connectMongo }
