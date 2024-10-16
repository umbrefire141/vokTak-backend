import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { InputCommentDto } from './comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_uuid: string, dto: InputCommentDto) {
    await this.prisma.comment.create({
      data: { post_uuid: dto.post_uuid, message: dto.message, user_uuid },
      include: {
        post: true,
        author: true,
      },
    });
    return 'Comment was added';
  }

  async update(id: number, dto: InputCommentDto) {
    await this.prisma.comment.update({
      where: { id },
      data: { message: dto.message },
    });
    return 'Comment was updated';
  }

  async delete(id: number) {
    await this.prisma.comment.delete({ where: { id } });
    return 'Comment was deleted';
  }
}
