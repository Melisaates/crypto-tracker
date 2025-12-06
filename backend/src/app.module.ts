import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PriceService } from './price/price.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PriceService],
})
export class AppModule {}
