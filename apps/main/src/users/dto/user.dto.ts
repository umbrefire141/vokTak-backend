import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { CommentDto } from '../../comments/comment.dto';
import { PhotoDto } from '../../photos/dto/photo.dto';
import { LikeDto } from '../../posts/dto/like.dto';
import { PostDto } from '../../posts/dto/post.dto';

export class AvatarDto {
  @Expose()
  id: number;
  @Expose()
  @Type(() => PhotoDto)
  avatar: PhotoDto;
}

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
  @ApiProperty({ example: 'example123' })
  nickname: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Nick' })
  firstname: string;

  @Expose()
  @IsString()
  @ApiProperty({ example: 'Smith' })
  lastname: string;

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
  @Type(() => UserDto)
  user: UserDto;
}
