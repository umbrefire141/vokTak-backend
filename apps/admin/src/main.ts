import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);

  const config = app.get(ConfigService);
  const PORT = config.get('PORT') || 5000;

  app.setGlobalPrefix('admin');

  await app.listen(PORT, async () => {
    console.log(`Server is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
