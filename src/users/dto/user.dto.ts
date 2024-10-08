import { ApiProperty } from '@nestjs/swagger';
import { LANGUAGES } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { CommentDto } from '../../comments/comment.dto';
import { PhotoDto } from '../../photos/dto/photo.dto';
import { LikeDto } from '../../posts/dto/like.dto';
import { PostDto } from '../../posts/dto/post.dto';
import { AvatarDto } from './avatar.dto';
import { UserInfoDto } from './user-info.dto';

export class UserDto {
  @Expose()
  uuid: string;

  @Expose()
  @ApiProperty({ required: false })
  @Type(() => AvatarDto)
  avatar?: AvatarDto;

  @Expose()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'exampleEmail@example.com' })
  email: string;

  @Expose()
  @IsString()
  @Length(2, 25)
  @ApiProperty({ example: 'example123' })
  nickname: string;

  @Expose()
  @IsString()
  @Length(2, 10)
  @ApiProperty({ example: 'Nick' })
  firstname: string;

  @Expose()
  @IsString()
  @Length(2, 10)
  @ApiProperty({ example: 'Smith' })
  lastname: string;

  @Expose()
  @IsEnum(LANGUAGES)
  language: LANGUAGES;

  @Expose()
  @Type(() => UserInfoDto)
  user_info?: UserInfoDto;

  @Expose()
  @Type(() => PostDto)
  posts: PostDto[];

  @Expose()
  @Type(() => CommentDto)
  comments: CommentDto[];

  @Expose()
  @Type(() => LikeDto)
  likes: LikeDto[];

  @Expose()
  @Type(() => FriendDto)
  friends: FriendDto[];

  @Expose()
  @Type(() => PhotoDto)
  photos: PhotoDto[];
}

export class FriendDto {
  @Expose()
  id: number;

  @Expose()
  confirmed: boolean;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => UserDto)
  userOf: UserDto;
}
