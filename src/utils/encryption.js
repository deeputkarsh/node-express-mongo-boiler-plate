import crypto from 'crypto'
import debug from 'debug'
import { ENCRYPTION } from '../config'
import { AppError } from '../utils'
import { httpStatus } from '../constants'

const { ENCRYPT_ALGO, ENCRYPT_KEY } = ENCRYPTION
const BUFFER_FORMAT = 'base64'
const keyBuffer = Buffer.from(ENCRYPT_KEY)
const log = debug('app:request')

const Cypher = {
  encrypt  (data) {
    const stringData = JSON.stringify(data)

    const ivBuffer = crypto.randomBytes(16)
    const ivString = ivBuffer.toString(BUFFER_FORMAT)
    const cipher = crypto.createCipheriv(ENCRYPT_ALGO, keyBuffer, ivBuffer)
    let cipherText = cipher.update(stringData, 'utf8', BUFFER_FORMAT)
    cipherText += cipher.final(BUFFER_FORMAT)
    const authTagBuffer = cipher.getAuthTag()
    const authTag = authTagBuffer.toString(BUFFER_FORMAT)

    // checksume to validate in decryption
    const checksum = hmacSha256(stringData, ENCRYPT_KEY)

    return { payload: [ivString, cipherText, authTag, checksum].join('.') }
  },
  decrypt ({ payload }) {
    const decryptData = payload.split('.')
    if (decryptData.length !== 4) {
      throw new AppError('Unauthorized', httpStatus.FORBIDDEN)
    }
    const [iv, encryptData, authTag, checksum] = decryptData

    const ivBuffer = Buffer.from(iv, BUFFER_FORMAT)
    const bufferAuth = Buffer.from(authTag, BUFFER_FORMAT)

    const cypher = crypto.createDecipheriv(ENCRYPT_ALGO, keyBuffer, ivBuffer)
    cypher.setAuthTag(bufferAuth)
    let decryptedData = cypher.update(encryptData, BUFFER_FORMAT, 'utf8')
    decryptedData += cypher.final('utf8')

    const hash = hmacSha256(decryptedData, ENCRYPT_KEY)
    if (hash !== checksum) {
      throw new AppError('Unauthorized', httpStatus.FORBIDDEN)
    }
    return JSON.parse(decryptedData)
  }
}
export const decryptMiddleware = (req, res, next) => {
  log('request URL', req.originalUrl)
  if (req.body && req.body.payload && !req.originalUrl.includes('/assessor/')) {
    req.body = Cypher.decrypt(req.body)
  }
  log('request body', req.body)
  next()
}

export const encrypt = data => Cypher.encrypt(data)

function hmacSha256 (plainText = '', salt = '') {
  const thisSalt = salt
  const hmac = crypto.createHmac('sha256', thisSalt)
  const hash = hmac.update(plainText, 'utf8').digest(BUFFER_FORMAT)
  return hash
}
