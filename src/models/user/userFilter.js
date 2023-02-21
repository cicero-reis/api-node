const removerQueryFields = require('./../../utils/removerQueryFields')

class UserFilter {
  constructor (query, req) {
    this.query = query
    this.req = req
  }

  filter () {
    const queryObject = removerQueryFields(['page', 'sort', 'limit', 'fields'], { ...this.req.query })

    if (queryObject.name) {
      this.query.where('name', {
        $regex: '.*' + queryObject.name + '.*'
      })
    }

    if (queryObject.email) {
      this.query.where('email')
        .equals(queryObject.email)
    }

    if (queryObject.createdAtStart && queryObject.createdAtEnd) {
      this.query.where({
        $where: `this.createdAt.toJSON().slice(0, 10) >= "${queryObject.createdAtStart.split('/').reverse().join('-')}"`
      }).and({
        $where: `this.createdAt.toJSON().slice(0, 10) <= "${queryObject.createdAtEnd.split('/').reverse().join('-')}"`
      })
    }

    return this
  }

  sort () {
    this.req.query.sort ? this.query.sort(this.req.query.page) : this.query.sort('title')
    return this
  }

  paginate () {
    const page = this.req.query.page * 1 || 1
    const limit = this.req.query.limit * 1 || 3
    const skip = (page - 1) * limit
    this.query.skip(skip).limit(limit)

    return this.query
  }
}

module.exports = UserFilter
