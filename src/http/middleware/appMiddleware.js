const morgan = require('morgan')
const rateLmit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const limiter = rateLmit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Houve muita requisição a partir deste IP, por favor tente depois de uma hora!'
})

const middleware = (app) => {
  if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'))
  }

  app.use(helmet())

  app.use(limiter)

  app.use(mongoSanitize())

  app.use(xss())

  app.use(hpp())

  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
  })
}

module.exports = middleware
