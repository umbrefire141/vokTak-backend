import { Expose } from 'class-transformer';
import { UserDto } from '../users/dto/user.dto';

export class RoleDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  users: UserDto[];
}
