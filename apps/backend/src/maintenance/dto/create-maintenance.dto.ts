import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNotEmpty,
  IsString,
  Min,
  IsOptional,
} from 'class-validator';
import { MaintenanceType, MileageUnit } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaintenanceDto {
  @ApiProperty({ example: 'OIL_CHANGE' })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ example: 'Changed engine oil and filter' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 79.99 })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ example: '2024-05-01' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(0)
  mileage: number;

  @ApiProperty({ example: 'KM', required: false })
  @IsEnum(MileageUnit)
  @IsOptional()
  mileageUnit?: MileageUnit;

  @ApiProperty({ example: 1 })
  @IsNumber()
  carId: number;
}
