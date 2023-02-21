const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const AppError = require('./../../error/appError.js')
const { UserModel } = require('./../../models/user')
const blocklist = require('./../../database/redis/blocklist')

class AuthMiddleware {

    static auth = async (req, res, next) => {

        try {
            let token = null
    
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1]
            }
            
            if (!token) return next(new AppError(JSON.stringify({notAutorization: 'Not authorized.'}), 401))
            
            // 01 Checks if the token was added to the block list on logout action
            const containTokenBlockList = await blocklist.containsKey(token)
            if (containTokenBlockList) {            
                return next(new AppError(JSON.stringify({tokenInvalid: 'Invalid token! '})))
            }

            // 02 Check token
            const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    
            // 03 Check if user exists
            const freshUser = await UserModel.findId(decoded.id)
    
            if (!freshUser) return next(new AppError(JSON.stringify({tokenNotExist: 'Token does not exist.'}), 401))
    
            // 04 Checks if the user changed the password after the token was generated
            if (freshUser.changedPasswordAfter(decoded.iat)) {
                return next(new AppError(JSON.stringify({changePassword: 'password changed'}), 401))
            }       
    
            req.user = freshUser
    
            next()

        } catch(err) {
            next(err)
        }

    }

    static restrictTo = (...roles) => {
        return (req, res, next) => {
            if(!roles.includes(req.user.role)) {
                return next(new AppError('Not authorized', 403))
            }
            next()
        }
    }   

}

module.exports = AuthMiddleware
