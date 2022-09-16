const redis = require('redis');
const {
  REDIS_SERVER_URL,
  REDIS_PORT,
  REDIS_PASS,
  REDIS_USERNAME,
} = require('../config/keys');

const redisClient = redis.createClient({
  url: `redis://${REDIS_SERVER_URL}:${REDIS_PORT}`,
  password: `${REDIS_PASS}`,
  username: `${REDIS_USERNAME}`,
});

redisClient.connect();

redisClient
  .on('connect', () => {
    console.log('Redis client connected to the server');
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
