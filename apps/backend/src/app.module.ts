import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [PrismaModule, CarsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
