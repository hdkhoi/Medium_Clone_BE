import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { ArticleModule } from './modules/article/article.module';
import { CommentModule } from './modules/comment/comment.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { typeORMConfig } from './configs/typeorm.config';
import { JwtModule, JwtModuleAsyncOptions } from '@nestjs/jwt';
import { jwtConfig } from './configs/jwt.config';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { TagModule } from './modules/tag/tag.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions =>
        typeORMConfig(configService), //useFactory dùng để gọi hàm
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService): JwtModuleAsyncOptions =>
        jwtConfig(configService),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => ({
        throttlers: [
          {
            name: 'login',
            ttl: configService.get<number>('THROTTLE_TTL') as number,
            limit: configService.get<number>('THROTTLE_LIMIT') as number,
          },
        ],
      }),
    }),
    UserModule,
    ArticleModule,
    CommentModule,
    AuthModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
