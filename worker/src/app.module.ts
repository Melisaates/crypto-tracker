import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerModule } from './worker.module';
import { PricesGateway } from './prices.gateway';

@Module({
  imports: [WorkerModule,PricesGateway],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
