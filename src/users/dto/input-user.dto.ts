import { ApiProperty, PickType } from '@nestjs/swagger';
import { LANGUAGES } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class InputUserDto extends PickType(UserDto, [
  'email',
  'nickname',
  'firstname',
  'lastname',
] as const) {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'examplePassword123' })
  password: string;
}

export class UpdateUserDto extends PickType(UserDto, [
  'nickname',
  'firstname',
  'lastname',
  'email',
]) {}

export class ChangePasswordUserDto {
  @Expose()
  @IsString()
  @ApiProperty({ example: 'oldPassword123' })
  oldPassword: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'newPassword123' })
  newPassword: string;
}

export class ChangeLanuageDto {
  @Expose()
  @IsEnum(LANGUAGES)
  @ApiProperty({ example: 'rus' })
  language: LANGUAGES;
}
