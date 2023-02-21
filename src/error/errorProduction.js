const logger = require('../services/logger')
const moment = require('moment')

class ErrorProduction {
  static sendErrorProd = (err, res) => {

    moment().locale('pt-br')
    
    logger.error({
        date: moment().format('DD/MM/YYYY HH:mm:ss'),
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })

    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })

      return
    }

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

module.exports = ErrorProduction
