import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const prefix = isProd ? '' : 'LOCAL_';

  const databaseUrl = configService.get<string>(`${prefix}DATABASE_URL`);

  if (!databaseUrl) {
    throw new Error(
      `Database URL missing for ${isProd ? 'PRODUCTION' : 'LOCAL'} environment!`,
    );
  }

  return {
    type: 'postgres',
    url: databaseUrl,
    autoLoadEntities: true,
    entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
    synchronize: !isProd,
    ssl: isProd ? { rejectUnauthorized: false } : false,
  };
};
