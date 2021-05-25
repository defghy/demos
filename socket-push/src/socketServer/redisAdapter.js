const redis = require('redis');
const adapter = require('socket.io-redis');

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD
} = process.env;

// const pub = redis.createClient(REDIS_PORT, REDIS_HOST, { password: REDIS_PASSWORD });
// const sub = redis.createClient(REDIS_PORT, REDIS_HOST, { password: REDIS_PASSWORD });

module.exports = {
  redisAdapter: adapter({ host: REDIS_HOST, port: REDIS_PORT })
};
