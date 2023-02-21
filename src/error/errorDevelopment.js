const logger = require('../services/logger')
const moment = require('moment')

class ErrorDevelopment {
  static sendErrorDev = (err, res) => {
    moment().locale('pt-br')
    logger.error({
        date: moment().format('DD/MM/YYYY HH:mm:ss'),
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })

    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }
}

module.exports = ErrorDevelopment
