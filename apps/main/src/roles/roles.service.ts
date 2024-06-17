import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    await this.createRoles();
  }
  async createRoles() {
    const roles = await this.prisma.role.findMany();

    if (roles.length > 0) {
      return false;
    }

    await this.prisma.role.createMany({
      data: [{ name: 'User' }, { name: 'Admin' }],
      skipDuplicates: true,
    });
  }
}
