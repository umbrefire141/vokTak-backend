import { PrismaService } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/chat/.env',
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, PrismaService],
})
export class ChatModule {}
