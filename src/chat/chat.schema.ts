import { userSchemaApi } from '@/users/user.schema';
import { ChatDto } from './dtos/chat.dto';

export const ChatSchemaApi: ChatDto = {
  id: 1,
  name: 'chat',
  messages: [
    {
      id: 1,
      message: 'hello world',
      photos: [],
      user: userSchemaApi,
    },
  ],
  users: [userSchemaApi],
};
