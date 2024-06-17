import { PrismaService } from '@app/common';
import { Pagination } from '@app/common/shared/decorators/pagination.decorator';
import { Injectable, NotFoundException } from '@nestjs/common';
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
        author: true,
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
          author: true,
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

  async updateImage(uuid: string, avatar: Express.Multer.File) {
    const path = avatar.path.replace(/\\/g, '/');

    return await this.prisma.post.update({
      where: { uuid },
      data: { image: path },
    });
  }
}
