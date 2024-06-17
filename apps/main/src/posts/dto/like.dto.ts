import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { PostDto } from './post.dto';

export class LikeDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => PostDto)
  post: PostDto;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
