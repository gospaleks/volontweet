import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Neo4jModule } from 'nest-neo4j';

import { JwtGlobalModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { TweetsModule } from './tweets/tweets.module';
import { HashtagsModule } from './hashtags/hashtags.module';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { createTypeOrmOptions } from './database/typeorm.config';
import { createNeo4jOptions } from './database/neo4j.config';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createTypeOrmOptions(configService),
    }),
    Neo4jModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createNeo4jOptions(configService),
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
    }),
    JwtGlobalModule,
    AuthModule,
    RedisModule,
    UsersModule,
    TweetsModule,
    HashtagsModule,
    CloudinaryModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
