import { PrismaService } from '@app/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const sid = request.signedCookies['sid'];

      await this.prisma.session.findUniqueOrThrow({
        where: { sid },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
