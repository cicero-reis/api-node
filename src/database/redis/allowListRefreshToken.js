const redis = require('redis')
const redisClient = require('./redisClient')

const client = redis.createClient({
  url: 'redis://redis:6379',
  prefix: 'allowlist-refresh-token:'
})

client.on('connect', () => {
  console.log('connected to redis successfully!')
})

client.on('error', (error) => {
  console.log('Redis connection error :', error)
})

module.exports = redisClient(client)
