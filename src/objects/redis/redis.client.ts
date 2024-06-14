import { Redis } from 'ioredis';

// Setup redis inside your local docker
// 1. Install redis using docker - docker run -d --name cp_redis -p 127.0.0.1:6379:6379 redis
// 2. Run the redis docker container - docker exec -it cp_redis sh
// reference - https://medium.com/geekculture/using-redis-with-docker-and-nodejs-express-71dccd495fd3

// alter this later with redis url after prod deployment
const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6379,
    retryStrategy: redisRetryStrategy(10, 5000),
});

function redisRetryStrategy(maxRetries: number, interval: number) {
    let retryCount = 0;
  
    return () => {
      if (retryCount < maxRetries) {
        retryCount += 1;
        console.log(
          `🟡 Retry attempt ${retryCount} in ${
            interval / 1000
          } seconds...`,
        );
        return interval;
      }
      return null;
    };
}

redisClient.on('error', (err) => {
    console.log('🔴 Error while connecting / accessing redis');
});

redisClient.on('connect', () => {
    console.log('🟢 Redis connection established.');
})

export { redisClient };
