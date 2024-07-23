import { PrismaService } from '@/prisma.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient<Socket>();
      const uuid = client.handshake.query.user_uuid as string;

      await this.prisma.user.findUniqueOrThrow({
        where: { uuid },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
