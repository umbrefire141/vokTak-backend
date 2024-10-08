import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UserInfoDto {
  @Expose()
  id: number;

  @Expose()
  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  languages?: string[];

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  currentCity?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  hometown?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description?: string;

  @Expose()
  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  favorite_movies?: string[];

  @Expose()
  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  favorite_games?: string[];

  @Expose()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  occupation?: string;

  @Expose()
  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  birth?: Date;

  @Expose()
  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false })
  hobbies?: string[];
}
