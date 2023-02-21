async function connect(client) {
    client.connect()
}
async function disconnect(client) {
    await client.disconnect();
}

module.exports = client => {
  return {

    async add (key, value, dateExpiresIn) {
      await connect(client)
      await client.set(key, value)
      await client.expire(key, dateExpiresIn)
      await disconnect(client)
    },

    async addToken (token) {
      await connect(client)
      await client.set(token, ' ')
      await disconnect(client)

    },

    async getKey (key) {
      await connect(client)
      const result = await client.get(key)
      await disconnect(client)
      return result
    },

    async containsKey (key) {
        await connect(client)
        const result = await client.exists(key)
        await disconnect(client)
        return result === 1
    },

    async delete (key) {
        await connect(client)
        await client.del(key)
        await disconnect(client)  
    }
  }
}
