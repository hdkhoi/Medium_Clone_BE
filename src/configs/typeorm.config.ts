import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path'; // Import 'join' từ 'path'

export const typeORMConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT') || 3307,
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: 'medium_clone_db',
    entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')],
    synchronize: false,
  };
};
