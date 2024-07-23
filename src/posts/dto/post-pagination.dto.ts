import { Expose, Type } from 'class-transformer';
import { PostDto } from './post.dto';

export class PostPaginationDto {
  @Expose()
  total: number;
  @Expose()
  page: number;
  @Expose()
  size: number;
  @Expose()
  @Type(() => PostDto)
  posts: PostDto[];
}
