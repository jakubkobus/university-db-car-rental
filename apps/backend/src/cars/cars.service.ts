import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private prisma: PrismaService) {}

  async create(createCarDto: CreateCarDto) {
    const { featureIds, categoryId, ...carData } = createCarDto;

    return this.prisma.car.create({
      data: {
        ...carData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        features:
          featureIds && featureIds.length > 0
            ? { connect: featureIds.map((id) => ({ id })) }
            : undefined,
      },
      include: {
        category: true,
        features: true,
      },
    });
  }

  async findAll() {
    return this.prisma.car.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
        features: true,
      },
    });
  }

  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
      include: {
        category: true,
        features: true,
        maintenance: true,
        reviews: true,
      },
    });

    if (!car) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    return car;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    await this.findOne(id);

    const { featureIds, categoryId, ...carData } = updateCarDto;

    return this.prisma.car.update({
      where: { id },
      data: {
        ...carData,
        category: categoryId ? { connect: { id: categoryId } } : undefined,

        features: featureIds
          ? { set: featureIds.map((fId) => ({ id: fId })) }
          : undefined,
      },
      include: {
        category: true,
        features: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.car.delete({
      where: { id },
    });
  }
}
