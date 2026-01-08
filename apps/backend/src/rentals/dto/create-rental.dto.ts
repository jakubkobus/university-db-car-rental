import { RentalStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateRentalDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsNumber()
  totalPrice: number;

  @IsEnum(RentalStatus)
  @IsOptional()
  status?: RentalStatus;

  @IsNumber()
  userId: number;

  @IsNumber()
  carId: number;
}
