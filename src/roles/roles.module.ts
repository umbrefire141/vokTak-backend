import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';

@Module({
  controllers: [],
  providers: [RolesService, PrismaService],
})
export class RolesModule {}
