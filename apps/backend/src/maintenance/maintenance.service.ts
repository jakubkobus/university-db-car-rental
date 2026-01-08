import { Injectable } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateMaintenanceDto) {
    return this.prisma.maintenance.create({
      data: {
        type: dto.type,
        description: dto.description,
        cost: dto.cost,
        date: new Date(dto.date),
        mileage: dto.mileage,
        mileageUnit: dto.mileageUnit,
        car: { connect: { id: dto.carId } },
      },
    });
  }

  findAll() {
    return this.prisma.maintenance.findMany({
      include: {
        car: { select: { brand: true, model: true, plateNumber: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.maintenance.findUnique({
      where: { id },
      include: {
        car: { select: { brand: true, model: true, plateNumber: true } },
      },
    });
  }

  update(id: number, dto: UpdateMaintenanceDto) {
    return this.prisma.maintenance.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.maintenance.delete({ where: { id } });
  }
}
