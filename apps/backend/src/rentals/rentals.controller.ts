import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  create(
    @Body() createRentalDto: CreateRentalDto,
    @Request() req: RequestWithUser,
  ) {
    createRentalDto.userId = req.user.id;
    return this.rentalsService.create(createRentalDto);
  }

  @Get('my')
  findMyRentals(@Request() req: RequestWithUser) {
    return this.rentalsService.findByUserId(req.user.id);
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRentalDto: UpdateRentalDto,
  ) {
    return this.rentalsService.update(id, updateRentalDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rentalsService.remove(id);
  }
}
