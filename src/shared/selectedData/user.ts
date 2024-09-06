import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export const userSelectedData: Prisma.UserSelect<DefaultArgs> = {
  uuid: true,
  avatar: {
    include: {
      photo: true,
    },
  },
  email: true,
  nickname: true,
  firstname: true,
  lastname: true,
  user_info: true,
  posts: {
    include: {
      comments: true,
      photos: true,
      likes: true,
      author: {
        include: {
          avatar: {
            include: {
              photo: true,
            },
          },
        },
      },
    },
  },
  created_at: true,
  password: false,
  friends: { include: { user: true } },
  photos: true,
};
