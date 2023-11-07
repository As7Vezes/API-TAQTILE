import { DataSource } from "typeorm";
import { join } from "path";
import { expect } from "chai";
import dotenv from 'dotenv'

dotenv.config()

const AppDataSource = new DataSource({
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
})

describe('Teste para conexão com o banco de dados', () => {
  it('conectar com o banco de dados', async () => {
    await AppDataSource.initialize().then(() => {
      console.log('Database connected')
      expect(AppDataSource.isConnected).to.be.true
    })

    await AppDataSource.close()
  })
})
