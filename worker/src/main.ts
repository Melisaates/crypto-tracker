import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WorkerModule } from './worker.module';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  //The reason why of not listening to any port is 
  // that this is a worker service that runs background tasks 
  // and does not handle HTTP requests directly.
  await app.init();
  console.log('Worker service is running...');
}
bootstrap();
