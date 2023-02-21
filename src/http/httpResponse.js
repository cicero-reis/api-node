const httpResponse = (res, status, data) => {
  return res.status(status).json({
    status: 'success',
    data
  })
}

module.exports = httpResponse
