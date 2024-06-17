import { PrismaService } from '@app/common';
import { CurrentUser } from '@app/common/shared/decorators/user.decorator';
import { AuthGuard } from '@app/common/shared/Guards/auth.guard';
import { InjectUserInterceptor } from '@app/common/shared/interceptors/InjectUser.interceptor';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageDto } from './dtos/message.dto';

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(InjectUserInterceptor)
  @SubscribeMessage('message')
  async sendMessage(
    @CurrentUser('uuid') user_uuid: string,
    @MessageBody() data: MessageDto,
  ) {
    const chat = await this.prisma.chat.findFirst({
      where: { id: data.chat_id },
    });

    return await this.prisma.message.create({
      data: { user_uuid, chat_id: chat.id, message: data.message },
    });
  }
}
