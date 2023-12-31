import { DataSource } from 'typeorm';
import { join } from 'node:path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '../entities/*.ts')],
  subscribers: [],
  migrations: [],
});
