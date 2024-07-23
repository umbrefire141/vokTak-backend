import { PhotoDto } from '@/photos/dto/photo.dto';
import { UserDto } from '@/users/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class MessageDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty()
  @IsString()
  message: string;

  @Expose()
  @Type(() => PhotoDto)
  photos: PhotoDto[];

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
