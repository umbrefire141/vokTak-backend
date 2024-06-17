import { PickType } from '@nestjs/swagger';
import { InputUserDto } from '../users/dto/input-user.dto';

export class AuthDto extends PickType(InputUserDto, [
  'email',
  'name',
  'password',
] as const) {}
