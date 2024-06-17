import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { CommentDto } from '../../comments/comment.dto';
import { UserDto } from '../../users/dto/user.dto';
import { LikeDto } from './like.dto';

export class PostDto {
  @Expose()
  uuid: string;

  @Expose()
  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;

  @Expose()
  @ApiProperty()
  @IsString()
  content: string;

  @Expose()
  @Type(() => UserDto)
  author: UserDto;

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  @Type(() => LikeDto)
  likes: LikeDto[];
}

export class InputPostDto extends PickType(PostDto, ['image', 'content']) {}
