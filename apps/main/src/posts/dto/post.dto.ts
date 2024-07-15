import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { CommentDto } from '../../comments/comment.dto';
import { PhotoDto } from '../../photos/dto/photo.dto';
import { UserDto } from '../../users/dto/user.dto';
import { LikeDto } from './like.dto';

export class PostDto {
  @Expose()
  uuid: string;

  @Expose()
  @ApiProperty()
  @IsString()
  content: string;

  @Expose()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @Expose()
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  @Type(() => LikeDto)
  likes: LikeDto[];

  @Expose()
  @Type(() => PhotoDto)
  photos: PhotoDto[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}

export class InputPostDto extends PickType(PostDto, ['content', 'hidden']) {}
