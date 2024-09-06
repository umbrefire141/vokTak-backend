import { PrismaService } from '@/prisma.service';
import { userSelectedData } from '@/shared/selectedData/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { v4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async registration(user_uuid: string) {
    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1e3);

    const session = await this.prisma.session.create({
      data: { sid: v4(), user_uuid },
    });
    return session.sid;
  }

  async login(user_uuid: string, hashedPassword: string, password: string) {
    const verifiedPassword = await compare(password, hashedPassword);

    if (!verifiedPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    const date = new Date();
    date.setTime(date.getTime() + 7 * 24 * 60 * 60 * 1e3);

    const session = await this.prisma.session.create({
      data: { sid: v4(), user_uuid },
    });

    return session.sid;
  }

  async logout(sid: string) {
    await this.prisma.session.delete({ where: { sid } });
    return 'Session was deleted';
  }

  async getMe(sid: string) {
    const user = await this.prisma.user.findFirst({
      where: { user_sessions: { some: { sid } } },
      select: { ...userSelectedData, chats: true },
    });

    return { user: user };
  }
}
