import { PhotoDto } from '@/photos/dto/photo.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { PostDto } from '../posts/dto/post.dto';
import { UserDto } from '../users/dto/user.dto';

export class CommentDto {
  @Expose()
  id: number;

  @Expose()
  @ApiProperty()
  @IsString()
  message: string;

  @Expose()
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  @Type(() => PostDto)
  post: PostDto;

  @Expose()
  @Type(() => PhotoDto)
  photos: PhotoDto[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}

export class InputCommentDto extends PickType(CommentDto, ['message']) {
  @Expose()
  @IsString()
  post_uuid: string;
}
