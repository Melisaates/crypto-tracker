import { ConfigurableModuleBuilder, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerService } from "./worker.service";
import { RedisService } from "./redis.service";
import { PriceLog } from "./price.entity";



@Module({
  imports: [
    ScheduleModule.forRoot(),
    // isGlobal makes the configuration available application-wide
    //ConfigModule means we can use environment variables throughout the application
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
    })

],
    providers: [WorkerService, RedisService],


})
export class WorkerModule {}