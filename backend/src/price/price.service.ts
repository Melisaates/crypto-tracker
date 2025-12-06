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
  private readonly logger = new Logger(PriceService.name);

  //injecting RedisService and PriceLog repository
  //to interact with Redis and the database
  //the repository is used to perform CRUD operations on PriceLog entities
  constructor(
    private readonly redis: RedisService,
    @InjectRepository(PriceLog) private readonly repo: Repository<PriceLog>,
  ) {}

  async getPrice(symbol: 'BTCUSDT') {
    const cacheKey = `price:${symbol}`;
    const cached = await this.redis.get(cacheKey);
    //check if price data is in Redis cache
    if (cached) {
      this.logger.log(`Cache hit for ${symbol}`);
      //return cached data if found
      return JSON.parse(cached);
    }

    this.logger.log(`Cache miss for ${cacheKey}, fetching from Binance `);
    const data = await this.fetchPriceFromBinance(symbol);
    const ttl = Number(process.env.REDIS_TTL) || 60;
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
    const res = await axios.get(url);

    return res.data;
  }
  binancePriceEndpoint(symbol: string) {
    return `${process.env.BINANCE_API_BASE_URL}/api/v3/ticker/price?symbol=${symbol}`;
  }


}
