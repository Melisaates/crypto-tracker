import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceModule } from './price/price.module';
import { PriceLog } from './price/entities/price.entity';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { PriceService } from './price/price.service';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([PriceLog]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'cryptodb',
        entities: [PriceLog],
        synchronize: true,
    }),
    // the reason why writing this module is 
    // because we need to use PriceService in worker module
    PriceModule,
    RedisModule,
  ],
  // the reason why not use redis service is because it is used in worker module
  // Providers is used to define the services that will be available within this module
  providers: [PriceService],
})
export class AppModule {}
