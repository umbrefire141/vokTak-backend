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
  language: true,
  user_info: true,
  posts: {
    include: {
      comments: {
        include: {
          author: {
            select: {
              avatar: {
                select: {
                  photo: true,
                },
              },
              email: true,
              firstname: true,
              lastname: true,
              nickname: true,
            },
          },
        },
      },
      photos: true,
      likes: {
        include: { user: true },
      },
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
  photos: true,
};
