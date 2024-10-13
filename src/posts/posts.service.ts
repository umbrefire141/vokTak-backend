import { PhotosService } from '@/photos/photos.service';
import { PrismaService } from '@/prisma.service';
import { postSelectedData } from '@/shared/selectedData/post';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/decorators/pagination.decorator';
import { InputPostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly photosService: PhotosService,
  ) {}

  async getAll({ page, limit, size, offset }: Pagination) {
    const posts = await this.prisma.post.findMany({
      take: limit,
      skip: offset,
      select: postSelectedData,
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
        select: postSelectedData,
      });
    } catch (error) {
      throw new NotFoundException("Post isn't found");
    }
  }

  async create(user_uuid: string, dto: InputPostDto) {
    return await this.prisma.post.create({
      data: {
        user_uuid,
        photos: {
          connect: dto.photoIds.map((id) => ({ id })),
        },
        content: dto.content,
        hidden: dto.hidden,
      },
      include: { photos: true },
    });
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

  async uploadImage(user_uuid: string, img: Express.Multer.File) {
    const path = img.path.replace(/\\/g, '/');
    return await this.photosService.addPhoto(
      {
        image: path,
        name: img.filename,
        hidden: false,
      },
      user_uuid,
    );
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

  async likePost(uuid: string, user_uuid: string) {
    return await this.prisma.post.update({
      where: { uuid },
      data: { likes: { create: { user_uuid } } },
    });
  }

  async unlikePost(uuid: string) {
    const post = await this.prisma.post.findFirst({
      where: { uuid },
      select: { likes: true },
    });

    const likeId = post.likes.find(({ user_uuid }) => user_uuid === uuid).id;

    return await this.prisma.like.delete({ where: { id: likeId } });
  }
}
