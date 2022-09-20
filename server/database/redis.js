const redis = require('redis');

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_SERVER_URL}:${process.env.REDIS_PORT}`,
  password: `${process.env.REDIS_PASS}`,
  username: `${process.env.REDIS_USERNAME}`,
  legacyMode: true,
});

redisClient.connect();

redisClient
  .on('connect', () => {
    console.log('Redis client connected to the server 📡');
  })
  .on('error', (err) => {
    console.log('Something went wrong with Redis client ❌: ', err);
  })
  .on('end', () => {
    console.log('Redis client disconnected 🔌');
  })
  .on('ready', () => {
    console.log('Redis client ready 🚀');
  })
  .on('reconnecting', () => {
    console.log('Redis client reconnecting 🔄');
  })
  .on('warning', (warning) => {
    console.log('Redis client warning ⚠️: ', warning);
  });

module.exports = redisClient;
