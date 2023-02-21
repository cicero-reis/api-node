const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const moment =  require('moment')
const crypto = require('crypto')

const sendEmail = require('./../../mail/email')
const { UserModel } = require('./../../models/user')
const AppError = require('./../../error/appError.js')
const UserResource = require('./../resource/userResource.js')
const allowListRefreshToken = require('./../../database/redis/allowListRefreshToken')
const blocklist = require('./../../database/redis/blocklist')

class AuthController {

    static signup = async (req, res, next) => {
        try {
            const user = await UserModel.store(req) 
    
            res.status(201).json({
                statusCode: 'success',
                data: {
                    user: UserResource.toJsonSignup(user)
                }
            })

        } catch(err) {
            next(err)
        }
    }

    static login = async (req, res, next) => {

        try {

            const { email, password } = req.body
    
            if (!email || !password) {
                return next(new AppError('Please enter your email and password.', 400))
            }
    
            const user = await UserModel.findOneEmailPassword(email)
    
            const correct = await user.correctPassword(password, user.password)
    
            if (!user || !correct) return next(new AppError('Incorrect email or password.', 401))
    
            const acessToken = this.createToken(user)
    
            const refreshToken = await this.createTokenOpaco(user)
    
            const cookieOptions = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
                secure: true
            }
    
            res.set('Authorization', acessToken)
    
            res.cookie('jwt', acessToken, cookieOptions)
    
            res.status(200).json({
                status: 'success',
                refreshToken
            })           

        } catch (err) {
            next(err)
        }
    }

    static logout = async (req, res, next) => {

        try {
            const token = req.headers.authorization.split(' ')[1]
            await blocklist.addToken(token);
            res.status(204).json()  

        } catch(err) {
            next(err)
        }
    }

    static refreshToken = async (req, res, next) => {

        const { refreshToken } = req.body

        if (!refreshToken) {
            return next(new AppError(JSON.stringify({refreshToken: 'Inform the refreshToken'}), 404))
        }

        const id = await allowListRefreshToken.getKey(refreshToken)

        if (!id) {
            return next(new AppError(JSON.stringify({refreshToken: 'Invalid'}, 404)))
        }

        await allowListRefreshToken.delete(refreshToken)

        const user = await UserModel.findId(id)

        const acessToken = this.createToken(user)

        const newRefreshToken = await this.createTokenOpaco(user)

        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
        }

        res.set('Authorization', acessToken)

        res.cookie('jwt', acessToken, cookieOptions)

        res.status(200).json({
            status: 'success',
            refreshToken: newRefreshToken
        })         
    }

    static createToken = (user) => {
        
        return jwt.sign(
            {
                id: user.id,
                updatedAt:  moment(user.updatedAt).format('YYYY-MM-DD HH:mm:ss')
            },
            process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        )
    }

    static createTokenOpaco = async (user) => {

        const tokenOpaco = crypto.randomBytes(24).toString('hex')
        const dateExpiresIn = moment().add(5, 'd').unix()

        await allowListRefreshToken.add(tokenOpaco, user.id, dateExpiresIn)

        return tokenOpaco
    }

    static forgotPassword = async (req, res, next) => {
        
        try {

            const { email } = req.body

            const user = await UserModel.findOne({email})
    
            if (!user) return next(new AppError('Email does not exist', 404))
    
            const resetToken = user.createPasswordResetToken()
    
            res.set('ResetToken', resetToken)
    
            await user.save({validateBeforeSave: false})
    
            const resetURL = `${process.env.BASE_URL}/resetPassword/${resetToken}`
    
            const message = `Forgot your password? Submit a PATCH request with your new password and 
            passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore the email!`

            await sendEmail({
                email: user.email,
                subject: 'To your password reset token (valid for 10 min)',
                message
            })
    
            res.status(200).json({
                status: 'success',
                message: 'Token sent to email',
            })
        } catch(err) {
            user.passwordResetToken = undefined,
            user.passwordResetExpires = undefined
            await user.save({validateBeforeSave: false})

            return next(new AppError('There was an error seding the email. Try again later!', 500))
        }
    }

    static resetPassword = async (req, res, next) => {

        try {

            const hashedToken = crypto
                .createHash('sha256')
                .update(req.params.token)
                .digest('hex')
    
            const user = await UserModel.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: Date.now() }
            })
            
            if (!user) return next(new AppError('Invalid or expired token', 400))
    
            user.password = req.body.password
            user.passwordConfirm = req.body.passwordConfirm
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save()
    
            res.status(200).json({
                status: 'success',
                token: this.createToken(user)
            })

        } catch(err) {
            next(err)
        }

    }

    static updatePassword = async (req, res, next) => {

        try {

            const user = await UserModel.findByIdPassword(req.user.id)
    
            if (!(await user.correctPassword(req.body.passwordCorrent, user.password))) {
                return next(new AppError('Your password does not match'))
            }
    
            user.password = req.body.password
            user.passwordConfirm = req.body.passwordConfirm
            await user.save()
    
            res.status(200).json({
                status: 'success',
                message: 'Password changed',
                token: this.createToken(user)
            })

        } catch(err) {
            next(err)
        }


    }
}

module.exports = AuthController
