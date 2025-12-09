import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || '3000';


  app.enableCors({
  origin: "*",
  credentials: true,
});

  await app.listen(parseInt(port, 10) || 3000);
  console.log(`Backend is running on ${port}`);
}
bootstrap();
