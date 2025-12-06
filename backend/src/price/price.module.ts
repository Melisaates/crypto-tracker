import { Module } from '@nestjs/common';
import { PriceService } from './price.service';
import { PriceController } from './price.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Redi } from 'src/redis/entities/redi.entity';
import { RedisModule } from 'src/redis/redis.module';
import { PriceLog } from './entities/price.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([PriceLog]),RedisModule ],
  controllers: [PriceController],
  //provides the PriceService
  providers: [PriceService],
  //exports the service to be used in other modules
  exports: [PriceService],
})
export class PriceModule {}
