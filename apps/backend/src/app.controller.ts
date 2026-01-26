import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get('stats')
  getStats() {
    return this.appService.getStats();
  }
}
