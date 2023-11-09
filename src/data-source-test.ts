import { DataSource } from 'typeorm';
import { join } from 'node:path';
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSourceTest = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5433,
  username: process.env.DB_USER_TEST,
  password: process.env.DB_PASSWORD_TEST,
  database: process.env.DB_NAME_TEST,
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '../entities/*.ts')],
  subscribers: [],
  migrations: [],
});
