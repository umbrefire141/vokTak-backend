import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';
import { InputChatDto } from './dtos/input-chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(user_uuid: string) {
    const chats = await this.prisma.chat.findMany({
      where: { users: { some: { uuid: user_uuid } } },
      include: {
        messages: true,
        users: true,
      },
    });

    return chats;
  }

  async getOne(id: number) {
    return await this.prisma.chat.findFirst({
      where: { id },
      include: {
        messages: {
          include: {
            user: {
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
        users: true,
      },
    });
  }

  async create(user_uuid: string, dto: InputChatDto) {
    return await this.prisma.chat.create({
      data: {
        name: dto.name,
        messages: {
          create: {
            message: dto.message,
            user_uuid: user_uuid,
          },
        },
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
