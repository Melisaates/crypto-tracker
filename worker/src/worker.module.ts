import { ConfigurableModuleBuilder, Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerService } from "./worker.service";
import { RedisService } from "../../backend/src/redis/redis.service";
import { PriceLog } from "../../backend/src/price/entities/price.entity";



@Module({
  imports: [
    ScheduleModule.forRoot(),
    // isGlobal makes the configuration available application-wide
    //ConfigModule means we can use environment variables throughout the application
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forFeature([PriceLog]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
        username: process.env.DATABASE_USER || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'password',
        database: process.env.DATABASE_NAME || 'cryptodb',
        entities: [PriceLog],
        synchronize: true,
    })

],
    providers: [WorkerService, RedisService],


})
export class WorkerModule {}