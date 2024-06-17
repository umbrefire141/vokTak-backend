import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { StreamModule } from './stream.module';

async function bootstrap() {
  const app = await NestFactory.create(StreamModule);

  const config = app.get(ConfigService);
  const PORT = config.get('PORT') || 5000;

  app.setGlobalPrefix('streams');

  await app.listen(PORT, async () => {
    console.log(`Server is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
