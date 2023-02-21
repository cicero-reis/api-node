const app = require('../../app')
const supertest = require('supertest')
const { User } = require('../../models/user')

const request = supertest(app)

describe('AuthControlle', () => {
  let objectUser
  let user
  let model
  let users
  let auth

  beforeEach(async () => {
    objectUser = {
      name: 'Dev One',
      email: 'dev_one@gmail.com',
      password: 'dev2022!',
      passwordConfirm: 'dev2022!',
      photo: 'myfoto'
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

  it('should register and return status 201 in the method signup', async () => {
    await request
      .post('/v1/signup')
      .send({
        name: 'Novo Usuário',
        email: 'novo@gmail.com',
        password: 'dev2022!',
        passwordConfirm: 'dev2022!'
      })
      .expect(201)
      .expect('Content-type', /json/)
  })

  it('should return an object and status 200 in the method login', async () => {
    await request
      .post('/v1/login')
      .send({
        email: 'dev_one@gmail.com',
        password: 'dev2022!'
      })
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should return status 204 in the method logout', async () => {
    await request
      .get('/v1/logout')
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .expect(204)
  })

  it('should return status 204 in the method refreshToken', async () => {
    await request
      .post('/v1/refreshToken')
      .send({
        refreshToken: auth.body.refreshToken
      })
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should return status 200 in the method forgotPassword', async () => {
    await request
      .post('/v1/forgotPassword')
      .send({
        email: 'dev_one@gmail.com'
      })
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should return status 200 in the method resetPassword', async () => {
    const res = await forgotPassword()

    await request
      .patch(`/v1/resetPassword/${res.headers.resettoken}`)
      .send({
        password: 'dev2022!',
        passwordConfirm: 'dev2022!'
      })
      .expect(200)
      .expect('Content-type', /json/)
  })

  it('should return status 200 in the method updatePassword', async () => {
    await request
      .patch('/v1/updatePassword')
      .set('Authorization', `Bearer ${auth.headers.authorization}`)
      .send({
        passwordCorrent: 'dev2022!',
        password: 'dev2023!',
        passwordConfirm: 'dev2023!'
      })
      .expect(200)
      .expect('Content-type', /json/)
  })
})

async function authentication () {
  const result = await request
    .post('/v1/login')
    .send({
      email: 'dev_one@gmail.com',
      password: 'dev2022!'
    })
    .then(data => { return data })

  return result
}

async function forgotPassword () {
  const result = await request
    .post('/v1/forgotPassword')
    .send({
      email: 'dev_one@gmail.com'
    })
    .then(data => { return data })

  return result
}
