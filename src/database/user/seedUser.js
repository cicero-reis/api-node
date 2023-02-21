const { User } = require('./../../models/user')

const userSeed = async () => {
  const user = new User()

  const object = await user.run({
    name: 'Fulano',
    email: 'fulano@gmail.com',
    password: 'dev2022!',
    passwordConfirm: 'dev2022!',
    photo: 'myfoto'
  })
    .then((data) => { return data })
    .catch((err) => { return err })

  await user.connectionClose()
}

userSeed()
