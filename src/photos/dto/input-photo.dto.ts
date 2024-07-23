import { PickType } from '@nestjs/swagger';
import { PhotoDto } from './photo.dto';

export class InputPhotoDto extends PickType(PhotoDto, [
  'name',
  'alt',
  'image',
  'hidden',
]) {}
