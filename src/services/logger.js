const winston = require('winston')
const fs = require('fs')

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs')
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/app.log',
      maxFiles: 10,
      maxsize: 100000
    })
  ]
})

module.exports = logger
