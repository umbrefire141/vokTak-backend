import { PhotosService } from '@/photos/photos.service';
import { PrismaService } from '@/prisma.service';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PhotosService, PrismaService],
})
export class PostsModule {}
