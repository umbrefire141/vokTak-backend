import { postSchemaApi } from '../posts/post.schema';
import { userSchemaApi } from '../users/user.schema';
import { CommentDto } from './comment.dto';

export const commentSchemaApi: CommentDto = {
  id: 1,
  message: 'hello world',
  author: userSchemaApi,
  post: postSchemaApi,
};
