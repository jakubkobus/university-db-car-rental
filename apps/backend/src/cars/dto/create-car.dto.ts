import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  Min,
  IsBoolean,
} from 'class-validator';
import { FuelType, MileageUnit, Transmission } from '@prisma/client';

export class CreateCarDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1900)
  year: number;

  @IsString()
  plateNumber: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  mileage: number;

  @IsEnum(MileageUnit)
  mileageUnit: MileageUnit;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsEnum(Transmission)
  transmission: Transmission;

  @IsNumber()
  @IsOptional()
  engineSize?: number;

  @IsNumber()
  @IsOptional()
  horsePower?: number;

  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @IsNumber()
  @Min(0)
  deposit: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  featureIds?: number[];
}
