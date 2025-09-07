import Redis from 'ioredis';

class RedisService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });

    this.redis.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });

    this.redis.on('error', (error) => {
      console.error('❌ Redis connection error:', error);
    });
  }

  // Basic cache operations
  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get(key);
    } catch (error) {
      console.error('Redis GET error:', error);
      return null;
    }
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    try {
      if (ttlSeconds) {
        await this.redis.setex(key, ttlSeconds, value);
      } else {
        await this.redis.set(key, value);
      }
      return true;
    } catch (error) {
      console.error('Redis SET error:', error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis DEL error:', error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis EXISTS error:', error);
      return false;
    }
  }

  // JSON operations
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis GET JSON error:', error);
      return null;
    }
  }

  async setJSON(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      return await this.set(key, jsonValue, ttlSeconds);
    } catch (error) {
      console.error('Redis SET JSON error:', error);
      return false;
    }
  }

  // Cache invalidation patterns
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        return await this.redis.del(...keys);
      }
      return 0;
    } catch (error) {
      console.error('Redis INVALIDATE PATTERN error:', error);
      return 0;
    }
  }

  // Analytics cache keys
  getAnalyticsKey(type: string, params: Record<string, any> = {}): string {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}:${params[key]}`)
      .join('|');
    return `analytics:${type}${paramString ? `:${paramString}` : ''}`;
  }

  // Job cache keys
  getJobCacheKey(jobId: string): string {
    return `job:${jobId}`;
  }

  // Application cache keys
  getApplicationCacheKey(applicationId: string): string {
    return `application:${applicationId}`;
  }

  // Rating cache keys
  getRatingCacheKey(ratingId: string): string {
    return `rating:${ratingId}`;
  }

  // User cache keys
  getUserCacheKey(userId: string): string {
    return `user:${userId}`;
  }

  // Cache invalidation methods
  async invalidateJobCache(jobId: string): Promise<void> {
    await this.invalidatePattern(`job:${jobId}*`);
    await this.invalidatePattern('analytics:jobs*');
    await this.invalidatePattern('analytics:overview*');
  }

  async invalidateApplicationCache(applicationId: string): Promise<void> {
    await this.invalidatePattern(`application:${applicationId}*`);
    await this.invalidatePattern('analytics:applications*');
    await this.invalidatePattern('analytics:overview*');
  }

  async invalidateRatingCache(ratingId: string): Promise<void> {
    await this.invalidatePattern(`rating:${ratingId}*`);
    await this.invalidatePattern('analytics:ratings*');
    await this.invalidatePattern('analytics:overview*');
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidatePattern(`user:${userId}*`);
  }

  // Analytics cache methods
  async getCachedAnalytics<T>(type: string, params: Record<string, any> = {}): Promise<T | null> {
    const key = this.getAnalyticsKey(type, params);
    return await this.getJSON<T>(key);
  }

  async setCachedAnalytics<T>(type: string, data: T, ttlSeconds: number = 300, params: Record<string, any> = {}): Promise<boolean> {
    const key = this.getAnalyticsKey(type, params);
    return await this.setJSON(key, data, ttlSeconds);
  }

  // Health check
  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis PING error:', error);
      return false;
    }
  }

  // Close connection
  async close(): Promise<void> {
    try {
      await this.redis.quit();
    } catch (error) {
      console.error('Redis CLOSE error:', error);
    }
  }
}

export const redisService = new RedisService();
