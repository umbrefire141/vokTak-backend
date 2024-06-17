import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/video/.env',
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
