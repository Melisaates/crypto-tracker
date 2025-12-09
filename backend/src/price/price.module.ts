import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'src/redis/redis.module';
import { PriceLog } from './entities/price.entity';
import { RedisService } from 'src/redis/redis.service';
import { PricesGateway } from './prices.gateway';

@Module({
  imports: [ TypeOrmModule.forFeature([PriceLog]), RedisModule ],
  controllers: [PriceController],
  //provides the PriceService
  providers: [PriceService, PricesGateway],
  //exports the service to be used in other modules
  exports: [PriceService, PricesGateway],
})
export class PriceModule {}
