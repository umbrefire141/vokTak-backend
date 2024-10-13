import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class PhotoDto {
  @Expose()
  id: number;
  @Expose()
  @ApiProperty({ required: true })
  @IsString()
  name: string;
  @Expose()
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  alt?: string;
  @Expose()
  @ApiProperty({ required: true })
  @IsString()
  image: string;
  @Expose()
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}
