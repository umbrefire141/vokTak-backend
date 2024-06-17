import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { VideoModule } from './video.module';

async function bootstrap() {
  const app = await NestFactory.create(VideoModule);

  const config = app.get(ConfigService);
  const PORT = config.get('PORT') || 5000;

  app.setGlobalPrefix('videos');

  await app.listen(PORT, async () => {
    console.log(`Server is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
