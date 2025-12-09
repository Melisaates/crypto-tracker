import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PriceLog } from "./price.entity";
import { Repository } from "typeorm";
import { RedisService } from "./redis.service";
import axios from "axios";
import { PricesGateway } from "./prices.gateway";
import { Cron } from "@nestjs/schedule";

export class WorkerService {

    private readonly logger = new Logger(WorkerService.name);
    private readonly pricesGateway: PricesGateway;
    // symbols to fetch prices for
    private  symbols: string[];
    private intervalSeconds :number; // Fetch prices every 60 seconds

    constructor(
        @InjectRepository(PriceLog) private readonly repo: Repository<PriceLog>,
        private readonly redis: RedisService
    ) {
        const env = process.env.PRICE_SYMBOLS || 'BTCUSDT';
        this.symbols = env.split(',').map(s => s.trim());
        this.intervalSeconds = Number(process.env.PRICE_FETCH_INTERVAL) || 15;
    }

    async fetch(symbol: string) {
        this.logger.log(`Fetching price for ${symbol}`);
        // Here you would implement the logic to fetch the price from an external API
        // For demonstration, we'll just log the action     
        try {
            const base = process.env.BINANCE_API_BASE!.replace(/\/+$/, '');
            const url = `${base}/api/v3/ticker/price?symbol=${symbol}`;

            const res = await axios.get(url);
            const {price} = res.data;

            await this.redis.set(`price:${symbol}`, price, 60); // Cache for 60 seconds

            //save to database
            const priceLog = this.repo.create({
                symbol,
                price,
                source: 'binance',
            });
            await this.repo.save(priceLog);
            this.logger.log(`Saved price for ${symbol}: ${price}`);
            this.pricesGateway.sendPriceUpdate(symbol, price);
            

        } catch (error) {
            this.logger.error(`Error fetching price for ${symbol}: ${error.message}`);
        }

    }

    @Cron(`*/${process.env.PRICE_FETCH_INTERVAL || 15} * * * * *`)
    async handleCron() {
        this.logger.log('Starting scheduled price fetch');  
        for (const symbol of this.symbols) {
            await this.fetch(symbol);
        }
    }
}