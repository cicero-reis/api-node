const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const moment = require('moment')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name']
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please enter a valid email']
    },
    photo: String,
    role: {
      type: String,
      enum: ['user', 'admin', 'dev'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please enter your password'],
      minlenght: 8
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password password'],
      // Somente CREATE e SAVE!!!
      validate: {
        validator: function (el) {
          return el === this.password
        },
        message: 'Password does not match'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    createdAt: {
      type: Date,
      get: (date) => moment(date).format('DD/MM/YYYY HH:mm:ss')
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true, virtuals: true }
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined

  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000

  next()
})

userSchema.methods.correctPassword = async (requestPassword, userPassword) => {
  const resp = await bcrypt.compare(requestPassword, userPassword)
  return resp
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    console.log(this.passwordChangedAt)

    return JWTTimestamp < changedTimestamp
  }

  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

userSchema.methods.run = async function (dados) {
  await mongoose.connect('mongodb://mongodb:27017')
  mongoose.model('User', userSchema)
  return mongoose.model('User', userSchema)
}

userSchema.methods.connectionClose = async function () {
    mongoose.connection.close()
}

const User = mongoose.model('User', userSchema)

module.exports = User
