import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServeStaticModule } from '@nestjs/serve-static';
import { redisStore } from 'cache-manager-redis-store';
import { join } from 'path';
import config from 'src/config/config';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CommentsModule } from './comments/comments.module';
import { FriendsModule } from './friends/friends.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PhotosModule } from './photos/photos.module';
import { PostsModule } from './posts/posts.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    ClientsModule.register([{ name: 'CHAT', transport: Transport.TCP }]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: './apps/main/.env',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api*'],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (config: ConfigService) => ({
        store: (await redisStore({
          ttl: config.get('CACHE_TTL'),
          // Later back in normal state
          // url: config.get('REDIS_URL'),
        })) as unknown as CacheStore,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    PhotosModule,
    VideosModule,
    ChatModule,
    NotificationsModule,
    FriendsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
