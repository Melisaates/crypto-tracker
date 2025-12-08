import { Injectable, Logger } from '@nestjs/common';
import { CreatePriceDto } from './dto/create-price.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { Redis } from 'ioredis';
import { RedisService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceLog } from './entities/price.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class PriceService {
  //this is used for logging purposes
  //Logger is a built-in NestJS utility for logging messages
  private readonly logger = new Logger(PriceService.name);

  //injecting RedisService and PriceLog repository
  //to interact with Redis and the database
  //the repository is used to perform CRUD operations on PriceLog entities
  constructor(
    private readonly redis: RedisService,
    // repository pattern is used to abstract the data layer
    // it provides a way to manage and query entities without exposing the underlying database details
    // InjectRepository is a decorator from TypeORM that allows us to inject a repository for a specific entity
    //entity means a table in the database
    @InjectRepository(PriceLog) private readonly repo: Repository<PriceLog>,
  ) {}

  async getPrice(symbol: 'BTCUSDT') {
    //create a unique cache key for the symbol. Because we may want to cache prices for multiple symbols in the future
    // the reason why create key with symbol is to avoid key collisions in Redis
    //example: price:BTCUSDT
    //price:ETHUSDT...etc
    const cacheKey = `price:${symbol}`;
    const cached = await this.redis.get(cacheKey);
    //check if price data is in Redis cache
    if (typeof cached === 'string') {
      //log cache hit 
      this.logger.log(`Cache hit for ${symbol}`);
      //return cached data if found
      return JSON.parse(cached);
    }

    this.logger.log(`Cache miss for ${cacheKey}, fetching from Binance `);
    const data = await this.fetchPriceFromBinance(symbol);
    //store fetched data in Redis cache with a TTL (time to live)
    //ttl is set in seconds, default to 60 seconds if not specified in env
    //ttl is used to automatically expire cache entries after a certain period
    const ttl = Number(process.env.REDIS_TTL) || 60;
    //store data in cache with TTL because price data can change frequently
    await this.redis.set(cacheKey, JSON.stringify(data), ttl);
    
    const priceLog = this.repo.create({
      symbol: data.symbol,
      price: data.price,
      source: 'binance '
    });
    await this.repo.save(priceLog);
    return data;
  }

  async fetchPriceFromBinance(symbol: 'BTCUSDT'){
    const url = this.binancePriceEndpoint(symbol);
    //make HTTP GET request to Binance API
    //the reason we use axios instead of NestJS HttpService is to keep it simple
    //If we were to use HttpService, we would need to set up additional modules and providers for example HttpModule in NestJS
    const res = await axios.get(url);

    return res.data;
  }
  //
  binancePriceEndpoint(symbol: string) {
    //construct the Binance API endpoint URL for fetching the price of the given symbol
    return `${process.env.BINANCE_API_BASE_URL}/api/v3/ticker/price?symbol=${symbol}`;
  }


  savePriceLog(symbol: string, price: string) {
    const priceLog = this.repo.create({
      symbol,
      price,
      source: 'binance',
    });
    return this.repo.save(priceLog);
  }


}
