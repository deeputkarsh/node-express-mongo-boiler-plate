import jsonwebtoken from 'jsonwebtoken'
import crypto from 'crypto'
import { JWT_CONFIG } from './environment'

export const otpGenerator = digits => {
  let randomNumber = parseInt(crypto.randomBytes(digits).toString('hex'), 16).toString()
  randomNumber = randomNumber.substr(0, digits)
  return randomNumber.padStart(digits, '0')
}

export const createToken = (data) => {
  return jsonwebtoken.sign(data, JWT_CONFIG.SECERET, { expiresIn: JWT_CONFIG.TOKEN_VALIDITY })
}
