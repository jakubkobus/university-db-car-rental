import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        user: { connect: { id: dto.userId } },
        car: { connect: { id: dto.carId } },
      },
    });
  }

  findAll() {
    return this.prisma.review.findMany({
      include: {
        user: { select: { firstName: true } },
        car: { select: { brand: true, model: true } },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            firstName: true,
          },
        },
        car: {
          select: {
            brand: true,
            model: true,
          },
        },
      },
    });
  }

  update(id: number, dto: Partial<CreateReviewDto>) {
    return this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.review.delete({
      where: { id },
    });
  }
}
