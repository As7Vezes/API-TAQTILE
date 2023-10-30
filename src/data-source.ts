import { DataSource } from 'typeorm';
import { join } from 'node:path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.1.1.0',
  port: 5432,
  username: 'userName',
  password: 'senha123',
  database: 'dbName',
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '../entities/*.ts')],
  subscribers: [],
  migrations: [],
});
