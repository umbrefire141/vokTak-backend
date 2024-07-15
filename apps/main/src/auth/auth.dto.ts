import { PickType } from '@nestjs/swagger';
import { InputUserDto } from '../users/dto/input-user.dto';

export class AuthDto extends PickType(InputUserDto, [
  'email',
  'nickname',
  'firstname',
  'lastname',
  'password',
] as const) {}

export class LoginDto extends PickType(InputUserDto, ['email', 'password']) {}
