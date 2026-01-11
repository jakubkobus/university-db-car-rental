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
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  model: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @Min(1900)
  year: number;

  @ApiProperty({ example: 'ABC-1234' })
  @IsString()
  plateNumber: string;

  @ApiProperty({ example: 'Red', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({
    example: 'A reliable and fuel-efficient sedan.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(0)
  mileage: number;

  @ApiProperty({ example: 'KM' })
  @IsEnum(MileageUnit)
  mileageUnit: MileageUnit;

  @ApiProperty({ example: 'PETROL' })
  @IsEnum(FuelType)
  fuelType: FuelType;

  @ApiProperty({ example: 'AUTOMATIC' })
  @IsEnum(Transmission)
  transmission: Transmission;

  @ApiProperty({ example: 2.0, required: false })
  @IsNumber()
  @IsOptional()
  engineSize?: number;

  @ApiProperty({ example: 150, required: false })
  @IsNumber()
  @IsOptional()
  horsePower?: number;

  @ApiProperty({ example: 75 })
  @IsNumber()
  @Min(0)
  pricePerDay: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0)
  deposit: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: 'http://example.com/car-image.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  featureIds?: number[];
}
