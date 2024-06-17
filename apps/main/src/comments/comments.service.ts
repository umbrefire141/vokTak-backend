import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InputCommentDto } from './comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(user_uuid: string, dto: InputCommentDto) {
    await this.prisma.comment.create({ data: { ...dto, user_uuid } });
    return 'Comment was added';
  }

  async update(id: number, dto: InputCommentDto) {
    await this.prisma.comment.update({ where: { id }, data: dto });
    return 'Comment was updated';
  }

  async delete(id: number) {
    await this.prisma.comment.delete({ where: { id } });
    return 'Comment was deleted';
  }
}
