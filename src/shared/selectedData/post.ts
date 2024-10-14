import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export const postSelectedData: Prisma.PostSelect<DefaultArgs> = {
  uuid: true,
  likes: {
    include: {
      post: true,
      user: true,
    },
  },
  content: true,
  hidden: true,
  shares: true,
  created_at: true,
  updated_at: true,
  comments: {
    include: {
      author: {
        select: {
          avatar: {
            select: {
              photo: true,
            },
          },
        },
      },
    },
  },
  author: {
    select: {
      email: true,
      firstname: true,
      lastname: true,
      nickname: true,
      avatar: {
        select: { photo: true },
      },
    },
  },
  photos: true,
};
