import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const host = configService.get<string>('POSTGRES_HOST') ?? 'localhost';
  const port = Number(configService.get<string>('POSTGRES_PORT') ?? 5432);
  const username = configService.get<string>('POSTGRES_USER') ?? 'postgres';
  const password = configService.get<string>('POSTGRES_PASSWORD') ?? 'postgres';
  const database = configService.get<string>('POSTGRES_DB') ?? 'volontweet';
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    autoLoadEntities: true,
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    synchronize: nodeEnv !== 'production',
  };
};
