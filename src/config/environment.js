export const MONGO_CONFIG = {
  URI: process.env.MONGO_URI,
  DEBUG: process.env.MONGO_DEBUG,
  SSl_CA: process.env.MONGO_SSL_CA,
  SSl_CERT: process.env.MONGO_SSL_CERT,
  SSl_KEY: process.env.MONGO_SSL_KEY
}
const { ALLOW_CORS_ORIGIN } = process.env
export const JWT_CONFIG = {
  SECERET: process.env.JWT_SECERET,
  TOKEN_VALIDITY: process.env.TOKEN_VALIDITY,
  NO_AUTH_PATHS: [
    '/health-check',
    '/version'
    /* new RegExp(`^${STRING_VARIABLE}/otp/.*`), */
  ]
}
export const CORS = {
  ORIGINS: ALLOW_CORS_ORIGIN.includes(',') ? ALLOW_CORS_ORIGIN.split(',') : ALLOW_CORS_ORIGIN,
  METHODS: process.env.ALLOW_CORS_METHODS
}

export const ENCRYPTION = {
  ENCRYPT_ALGO: process.env.ENCRYPT_ALGO,
  ENCRYPT_KEY: process.env.ENCRYPT_KEY
}
