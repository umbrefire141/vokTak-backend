import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ChatDto } from './dtos/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(user_uuid: string) {
    return await this.prisma.chat.findMany({
      where: { users: { some: { uuid: user_uuid } } },
    });
  }

  async getOne(id: number) {
    return await this.prisma.chat.findFirst({ where: { id } });
  }

  async create(user_uuid: string, dto: ChatDto) {
    return await this.prisma.chat.create({
      data: {
        name: dto.name,
        users: {
          connect: [
            { uuid: user_uuid },
            ...dto.receiver_uuids.map((uuid) => ({ uuid })),
          ],
        },
      },
    });
  }

  async delete(id: number) {
    return await this.prisma.chat.delete({ where: { id } });
  }
}
