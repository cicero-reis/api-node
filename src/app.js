require('dotenv').config()

const express = require('express')
const MongoDB = require('./database/mongodb/connect')
const middleware = require('./http/middleware/appMiddleware')
const routes = require('./routes')
const AppError = require('./error/appError')
const errorHttp = require('./error/errorHttp')

const app = express()

app.use(express.json({ limit: '10kb' }))

MongoDB.connectDB()

require('./database/redis/blocklist')
require('./database/redis/allowListRefreshToken')

middleware(app)

routes(app)

app.all('*', (req, res, next) => {
  next(new AppError(`Could not find resource ${req.originalUrl} on server.`, 404))
})

app.use(errorHttp)

module.exports = app
