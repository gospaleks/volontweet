import { ConfigService } from '@nestjs/config';
import { Neo4jConnection, Neo4jScheme } from 'nest-neo4j';

export const createNeo4jOptions = (
  configService: ConfigService,
): Neo4jConnection => {
  const scheme =
    (configService.get<string>('NEO4J_SCHEME') as Neo4jScheme | undefined) ??
    'neo4j';

  const host = configService.get<string>('NEO4J_HOST') ?? 'localhost';
  const port = Number(configService.get<string>('NEO4J_PORT') ?? 7687);
  const username = configService.get<string>('NEO4J_USERNAME') ?? 'neo4j';
  const password =
    configService.get<string>('NEO4J_PASSWORD') ?? 'neo4jpassword';

  return {
    scheme,
    host,
    port,
    username,
    password,
  };
};
