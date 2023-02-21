const UserRepository = require('./userRepository')
const User = require('./userModel')
const UserFilter = require('./userFilter')

const UserModel = new UserRepository(User)

module.exports = { User, UserModel, UserFilter }
