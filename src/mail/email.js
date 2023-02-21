const nodemailer = require('nodemailer')

const sendEmail = options => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_AUTH_USER,
      pass: process.env.EMAIL_AUTH_PASS
    }
  })

  const mailOptions = {
    from: 'API Node <api_node@node.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  }

  transport.sendMail(mailOptions)
}

module.exports = sendEmail
