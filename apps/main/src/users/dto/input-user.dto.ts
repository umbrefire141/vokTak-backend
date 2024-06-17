import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class InputUserDto extends PickType(UserDto, [
  'email',
  'name',
] as const) {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class UpdateUserDto extends PickType(UserDto, ['name', 'email']) {}
