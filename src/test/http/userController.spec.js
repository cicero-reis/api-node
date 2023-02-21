const app = require('../../app')
const supertest = require('supertest')
const { User } = require('../../models/user')

const request = supertest(app)

describe('UserController', () => {
  let objectUser
  let user
  let model
  let users
  let auth

  beforeEach(async () => {
    objectUser = {
      name: 'Dev One',
      email: 'dev_one@gmail.com',
      password: 'dev2023!',
      passwordConfirm: 'dev2023!',
      photo: 'myfoto',
      role: 'dev'
    }

    user = new User()
    model = await user.run()

    await model.deleteMany({})
    await model.create(objectUser)

    users = await model.find()

    auth = await authentication()
  })

  afterEach(async () => {
    await user.connectionClose()
  })

  it('should return an object and status 200 in the method all', async () => {
    await request
      .get('/v1/users')
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should return single object and status 200 in the method show', async () => {
    const { _id } = users[0]

    await request
      .get(`/v1/users/${_id}`)
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should register and return status 201 in the method store', async () => {
    await request
      .post('/v1/users')
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .send({
        name: 'New User',
        email: 'new_user@gmail.com',
        password: 'dev2023!',
        passwordConfirm: 'dev2023!'
      })
      .expect(201)
      .expect('Content-type', /json/)
  })

  it('should update and return status 200 in the method update', async () => {
    const { _id } = users[0]
    await request
      .put(`/v1/users/${_id}`)
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .set({ connection: 'keep-alive' })
      .field('name', 'Dev Two')
      .attach('photo', '')
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should delete and return status 200 in the method delete', async () => {
    const { _id } = users[0]

    await request
      .delete(`/v1/users/${_id}`)
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .set({ connection: 'keep-alive' })
      .expect(200)
      .expect('Content-type', /json/)
  })
})

async function authentication () {
  const result = await request
    .post('/v1/login')
    .send({
      email: 'dev_one@gmail.com',
      password: 'dev2023!'
    })
    .then(data => { return data })

  return result
}
