import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getStats() {
    const [totalCars, availableCars, totalRentals, pendingRentals, totalUsers, totalRevenue] = await Promise.all([
      this.prisma.car.count(),
      this.prisma.car.count({ where: { isAvailable: true } }),
      this.prisma.rental.count(),
      this.prisma.rental.count({ where: { status: 'PENDING' } }),
      this.prisma.user.count(),
      this.prisma.rental.aggregate({
        _sum: { totalPrice: true },
      }).then(res => res._sum.totalPrice || 0),
    ]);

    return {
      totalCars,
      availableCars,
      totalRentals,
      pendingRentals,
      totalUsers,
      totalRevenue: Number(totalRevenue),
    };
  }
}
