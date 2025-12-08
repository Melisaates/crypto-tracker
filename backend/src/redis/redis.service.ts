import { Injectable } from '@nestjs/common';
import { error } from 'console';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {

    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number(process.env.REDIS_PORT ) || 6379;
    this.client = new Redis({
      host: host,
      port: port,
    });
  }

  async set(cacheKey: string, arg1: string, ttl?: number) {
    if (ttl) 
      this.client.set(cacheKey, arg1, 'EX', ttl);
    else
      this.client.set(cacheKey, arg1);
  }



  //get value from redis by key
  async get(cachekey: string) {
    try {
      const data = await this.client.get(cachekey);
      return data;
    } catch (err) {
      console.error('Error getting cache:', err);
      return null;
    }

  }

  //return redis client
  // Difference between getClient and get is that getClient returns the Redis client instance itself, 
  // allowing direct interaction with Redis commands, 
  // while get retrieves the value associated with a specific key from the Redis store.
  //for example, getClient return this.client, so we can use this.client.set(), this.client.get() etc. 
  // , get method only return value of a specific key.
  getClient() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }



}
