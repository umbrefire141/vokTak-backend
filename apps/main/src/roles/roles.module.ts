import { PrismaService } from '@app/common';
import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';

@Module({
  controllers: [],
  providers: [RolesService, PrismaService],
})
export class RolesModule {}
