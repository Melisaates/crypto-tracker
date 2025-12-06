import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceModule } from './price/price.module';
import { PriceLog } from './price/price.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PriceModule } from './price/price.module';
import { PriceService } from './price/price.service';
import { RedisModule } from './redis/redis.module';
import { PriceModule } from './price/price.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'cryptodb',
      entities: [PriceLog],
      synchronize: true,
    }),
    PriceModule,
    RedisModule,
  ],
  providers: [PriceService],
})
export class AppModule {}
