import { PrismaService } from '@/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(user_uuid: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { user_uuid },
    });

    return notifications;
  }

  async sendNotification(user_uuid: string, message: string) {
    const createdNotification = await this.prisma.notification.create({
      data: {
        message,
        user_uuid,
      },
    });

    return createdNotification;
  }
}
