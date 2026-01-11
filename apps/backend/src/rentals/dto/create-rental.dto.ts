import { RentalStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRentalDto {
  @ApiProperty({ example: '2024-06-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-06-10' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ example: 'CONFIRMED', required: false })
  @IsEnum(RentalStatus)
  @IsOptional()
  status?: RentalStatus;

  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  carId: number;
}
