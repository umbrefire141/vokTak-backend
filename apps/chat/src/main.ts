import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);

  const config = app.get(ConfigService);
  const PORT = config.get('PORT') || 5000;

  await app.listen(PORT, async () => {
    console.log(`Chat server is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
