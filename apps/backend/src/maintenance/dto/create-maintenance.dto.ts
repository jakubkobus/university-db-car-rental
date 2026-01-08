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

export class CreateMaintenanceDto {
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  cost: number;

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsEnum(MileageUnit)
  @IsOptional()
  mileageUnit?: MileageUnit;

  @IsNumber()
  carId: number;
}
