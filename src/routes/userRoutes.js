const express = require('express')
const UserController = require('../http/controllers/userController')
const AuthMiddleware = require('./../http/middleware/authMiddleware')
const { uploadUserPhoto, resizeUserPhoto } = require('./../models/user/userUpload')

const router = express.Router()

router
  .get('/v1/users', AuthMiddleware.auth, UserController.all)
  .get('/v1/users/:id', AuthMiddleware.auth, UserController.show)
  .post('/v1/users', AuthMiddleware.auth,  AuthMiddleware.restrictTo('admin', 'dev', 'user'), UserController.store)
  .put('/v1/users/:id', AuthMiddleware.auth, AuthMiddleware.restrictTo('admin', 'dev', 'user'), uploadUserPhoto, resizeUserPhoto, UserController.update)
  .delete('/v1/users/:id', AuthMiddleware.auth, AuthMiddleware.restrictTo('admin', 'dev', 'user'), UserController.delete)

module.exports = router
