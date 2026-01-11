import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'SUV' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Sport Utility Vehicle category',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
