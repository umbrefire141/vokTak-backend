import { commentSchemaApi } from '../comments/comment.schema';
import { photoSchemaApi } from '../photos/photo.schema';
import { userSchemaApi } from '../users/user.schema';
import { PostDto } from './dto/post.dto';

export const postSchemaApi: PostDto = {
  uuid: 'tsetu325a',
  content: 'Hello world',
  author: userSchemaApi,
  hidden: false,
  likes: [],
  comments: [commentSchemaApi],
  photos: [photoSchemaApi],
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
};
