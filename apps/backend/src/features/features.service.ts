import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateFeatureDto) {
    return this.prisma.feature.create({ data: dto });
  }

  findAll() {
    return this.prisma.feature.findMany();
  }

  findOne(id: number) {
    return this.prisma.feature.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateFeatureDto) {
    return this.prisma.feature.update({ where: { id }, data: dto });
  }

  remove(id: number) {
    return this.prisma.feature.delete({ where: { id } });
  }
}
