const { User } = require('../../models/user')

describe('UserModel', () => {
  let objectUser
  let user
  let model
  let users

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
  })

  afterEach(async () => {
    await user.connectionClose()
  })

  it('should instance new user', async () => {
    const object = new User(objectUser)
    expect(object).toEqual(
      expect.objectContaining(objectUser)
    )
  })

  it('should register a user', async () => {
    const userCreate = await model.create({
      name: 'Dev Test',
      email: 'dev_test@gmail.com',
      password: 'dev2022!',
      passwordConfirm: 'dev2022!'
    })

    expect(userCreate.name).toBe('Dev Test')
  })

  it('should return a single object', async () => {
    const { _id } = users[0]
    const response = await model.findById(_id)
    expect(response.name).toEqual(objectUser.name)
  })

  it('should update a user', async () => {
    const { _id } = users[0]
    const body = {
      name: 'Dev Two'
    }
    const userUpdate = await model.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true
    })
    expect(userUpdate.name).toBe('Dev Two')
  })

  it('should delete a user', async () => {
    const { _id } = users[0]

    const userUpdate = await model.findByIdAndUpdate(
      _id,
      {
        deletedAt: new Date().toISOString()
      },
      {
        new: true,
        runValidators: true
      })
    const { deletedAt } = userUpdate
    expect(deletedAt).not.toBe(null)
  })
})
