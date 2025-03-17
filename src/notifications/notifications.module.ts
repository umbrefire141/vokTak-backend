import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsService } from './notifications.service';

@Module({
  providers: [NotificationsGateway, NotificationsService, PrismaService],
})
export class NotificationsModule {}
