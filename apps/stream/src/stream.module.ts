import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamController } from './stream.controller';
import { StreamService } from './stream.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/stream/.env',
    }),
  ],
  controllers: [StreamController],
  providers: [StreamService],
})
export class StreamModule {}
