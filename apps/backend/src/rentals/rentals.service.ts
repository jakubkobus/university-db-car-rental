import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RentalsService {
  constructor(private prisma: PrismaService) {}

  async create(createRentalDto: CreateRentalDto) {
    const dto = { ...createRentalDto };
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (start >= end)
      throw new BadRequestException('End date must be after start date');

    return this.prisma.rental.create({
      data: {
        startDate: start,
        endDate: end,
        totalPrice: dto.totalPrice,
        car: { connect: { id: dto.carId } },
        user: { connect: { id: dto.userId } },
      },
      include: {
        car: true,
        user: true,
      },
    });
  }

  findAll() {
    return this.prisma.rental.findMany({
      include: {
        car: {
          select: { brand: true, model: true, plateNumber: true },
        },
        user: {
          select: { email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.rental.findUnique({
      where: { id },
      include: { car: true, user: true },
    });
  }

  // Prosty update statusu
  update(id: number, updateRentalDto: UpdateRentalDto) {
    return this.prisma.rental.update({
      where: { id },
      data: updateRentalDto,
    });
  }

  remove(id: number) {
    return this.prisma.rental.delete({ where: { id } });
  }
}
