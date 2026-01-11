import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeatureDto {
  @ApiProperty({ example: 'Sunroof' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'http://example.com/icon.png', required: false })
  @IsString()
  @IsOptional()
  icon?: string;
}
