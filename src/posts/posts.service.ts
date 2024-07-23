import { PrismaService } from '@/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { InputPhotoDto } from '../photos/dto/input-photo.dto';
import { InputPostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getAll({ page, limit, size, offset }: Pagination) {
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: offset,
      include: {
        comments: true,
        likes: true,
        author: {
          include: { avatar: true },
        },
        photos: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return {
      posts,
      total: posts.length,
      page,
      size,
    };
  }

  async getOne(uuid: string) {
    try {
      return await this.prisma.post.findFirstOrThrow({
        where: { uuid },
        include: {
          comments: true,
          likes: true,
          author: {
            include: { avatar: true },
          },
          photos: true,
        },
      });
    } catch (error) {
      throw new NotFoundException("Post isn't found");
    }
  }

  async create(user_uuid: string, dto: InputPostDto) {
    return await this.prisma.post.create({ data: { user_uuid, ...dto } });
  }

  async update(user_uuid: string, post_uuid: string, dto: InputPostDto) {
    return await this.prisma.post.update({
      where: { uuid: post_uuid },
      data: { user_uuid, ...dto },
    });
  }

  async delete(post_uuid: string) {
    return await this.prisma.post.delete({ where: { uuid: post_uuid } });
  }

  async uploadImage(
    uuid: string,
    user_uuid: string,
    avatar: Express.Multer.File,
    dto: InputPhotoDto,
  ) {
    const path = avatar.path.replace(/\\/g, '/');

    return await this.prisma.post.update({
      where: { uuid },
      data: { photos: { create: { user_uuid, image: path, ...dto } } },
    });
  }

  async hidePost(uuid: string) {
    return await this.prisma.post.update({
      where: { uuid },
      data: { hidden: true },
    });
  }

  async unhidePost(uuid: string) {
    return await this.prisma.post.update({
      where: { uuid },
      data: { hidden: false },
    });
  }
}
