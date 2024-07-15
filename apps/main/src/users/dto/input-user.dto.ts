import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
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
