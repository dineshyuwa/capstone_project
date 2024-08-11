import { redisClient } from './redis.client';

class RedisService {
  async set(key: string, value: string) {
    redisClient.set(key, value);
  }

  async setWithExpiry(key: string, value: string, expiresAt = 86400) {
    redisClient.set(key, value, 'EX', expiresAt);
  }

  async get(key: string) {
    return redisClient.get(key);
  }

  async delete(key: string) {
    redisClient.del(key);
  }

  async expire(key: string, seconds: number) {
    return redisClient.expire(key, seconds);
  }
};

export const redisService = new RedisService();
