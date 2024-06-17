import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CommentDto } from '../../comments/comment.dto';
import { LikeDto } from '../../posts/dto/like.dto';

export class UserDto {
  @Expose()
  uuid: string;

  @Expose()
  @IsOptional()
  @IsString()
  avatar?: string;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Expose()
  @IsString()
  @ApiProperty()
  name: string;

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  @Type(() => LikeDto)
  likes: LikeDto[];

  @Expose()
  @Type(() => FriendDto)
  friends: FriendDto[];
}

export class FriendDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
