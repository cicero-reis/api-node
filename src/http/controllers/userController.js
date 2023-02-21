const httpResponse = require('./../httpResponse')
const { UserModel } = require('./../../models/user')
const UserResource = require('./../resource/userResource')

class UserController {
  static async all (req, res, next) {
    try {
      const users = await UserModel.all(req)
      httpResponse(res, 200, UserResource.toJsonAll(users, res))
    } catch (err) {
      next(err)
    }
  }

  static async show (req, res, next) {
    try {
      const user = await UserModel.show(req)
      httpResponse(res, 200, UserResource.toJson(user, res))
    } catch (err) {
      next(err)
    }
  }

  static async store (req, res, next) {
    try {
      const user = await UserModel.store(req)
      httpResponse(res, 201, UserResource.toJson(user, res))
    } catch (err) {
      next(err)
    }
  }

  static async update (req, res, next) {
    try {
      delete req.body.password
      delete req.body.passwordConfirm
      const user = await UserModel.update(req)
      httpResponse(res, 200, UserResource.toJson(user, res))
    } catch (err) {
      next(err)
    }
  }

  static async delete (req, res, next) {
    try {
      const user = await UserModel.delete(req)
      const message = (user != null) ? 'Usuário removido' : 'Nenhum registro encontrado'
      httpResponse(res, 200, { message })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController
