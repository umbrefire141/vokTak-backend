import { Expose, Type } from 'class-transformer';
import { PhotoDto } from '../../photos/dto/photo.dto';

export class AvatarDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => PhotoDto)
  photo: PhotoDto;
}
