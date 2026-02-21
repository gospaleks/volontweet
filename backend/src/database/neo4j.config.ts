import { ConfigService } from '@nestjs/config';
import { Neo4jConnection, Neo4jScheme } from 'nest-neo4j';

export const createNeo4jOptions = (
  configService: ConfigService,
): Neo4jConnection => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const prefix = isProd ? '' : 'LOCAL_';

  const defaultScheme = isProd ? 'neo4j+s' : 'neo4j';
  const scheme =
    (configService.get<string>(`${prefix}NEO4J_SCHEME`) as Neo4jScheme) ??
    defaultScheme;

  const host =
    configService.get<string>(`${prefix}NEO4J_HOST`) ??
    (isProd ? '' : 'localhost');

  const port = configService.get<number>(`${prefix}NEO4J_PORT`) ?? 7687;

  const username =
    configService.get<string>(`${prefix}NEO4J_USERNAME`) ?? 'neo4j';

  const password =
    configService.get<string>(`${prefix}NEO4J_PASSWORD`) ??
    (isProd ? '' : 'neo4jpassword');

  if (isProd && (!host || !password)) {
    throw new Error(
      'PRODUCTION ERROR: Neo4j Cloud credentials (host/password) are missing!',
    );
  }

  return {
    scheme,
    host,
    port,
    username,
    password,
  };
};
