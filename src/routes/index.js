const authRoutes = require('./authRoutes')
const userRoutes = require('./userRoutes')

const routes = (app) => {
  app.use(
    authRoutes,
    userRoutes
  )
}

module.exports = routes
