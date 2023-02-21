const express = require('express')
const AuthController = require('./../http/controllers/authController')
const AuthMiddleware = require('./../http/middleware/authMiddleware')

const router = express.Router()

router
  .post('/v1/signup', AuthController.signup)
  .post('/v1/login', AuthController.login)
  .get('/v1/logout', AuthMiddleware.auth, AuthController.logout)
  .post('/v1/forgotPassword', AuthController.forgotPassword)
  .patch('/v1/resetPassword/:token', AuthController.resetPassword)
  .post('/v1/refreshToken', AuthController.refreshToken, AuthController.login)
  .patch('/v1/updatePassword', AuthMiddleware.auth, AuthController.updatePassword)

module.exports = router
