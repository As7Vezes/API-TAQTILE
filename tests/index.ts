import { expect } from "chai";
import { resolvers } from '../src/index'
import { AppDataSourceTest } from "../src/data-source-test";
import bcrypt from 'bcrypt';

describe('Teste para conexão com o banco de dados', () => {

  it('conectar com o banco de dados', async () => {
    await AppDataSourceTest.initialize().then(() => {
      console.log('Database connected')
      expect(AppDataSourceTest.isConnected).to.be.true

    })

  })

  it('Deve retornar os dados do banco igual ao do objeto', async () => {

    const password = 'dihg91283'

    const user = {
      id: 13,
      name: 'namezes',
      email: 'namzes@email24.com',
      password: password,
      birthData: '15/01/2005'
    }

    const createUser = await resolvers.Mutation.createUser({}, {data: user})

    const compraePassoword = async () => {
        return new Promise((resolver, reject) => {
          bcrypt.compare(password, createUser.password, (err, result) => {
            if(err) {
              console.log(err)
              return
            }

            if(err) {
              reject(err) 
            } else {
              resolver(result)
            }

          })
       })

    }

    try {
      const result = await compraePassoword()

      if(result) {
        user.password = createUser.password
      }

      else {
        console.log('Senha incorreta')
      }

      expect(createUser).to.be.deep.include(user)
    } catch (error) {
      console.log(error)
    }

    await AppDataSourceTest.close()
    
  })
})