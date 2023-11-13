import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSourceTest } from './data-source-test';
import { User } from '../entities/User';
import { UserInputError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';
import { MyError } from '../utils/Error';

export const typeDefs = gql`
  type User {
    id: String
    name: String
    email: String
    birthData: String
  }

  input UserInput {
    name: String
    email: String
    password: String
    birthData: String
  }

  type Mutation {
    createUser(data: UserInput): User
  }

  type Query {
    users: [User]
  }
`;

export const resolvers = {
  Query: {
    users: async () => {
      const repo = AppDataSourceTest.getRepository(User);
      const users = await repo.find();
      return users;
    },
  },
  Mutation: {
    createUser: async (_: any, { data }: { data: User }) => {
      const repo = AppDataSourceTest.getRepository(User);

      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!regexEmail.test(data.email)) {
        throw new MyError('Formato de email inválido', 'BAD_USER_INPUT');
      }

      if (!regexPassword.test(data.password)) {
        throw new MyError(
          'Parça a Senha inválida',
          'BAD_USER_INPUT',
          'A senha deve conter no mínimo uma letra e um número e deve ser igual ou maior que 6 caracteres',
        );
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = repo.create({
        name: data.name,
        email: data.email,
        password: passwordHash,
        birthData: data.birthData,
      });

      try {
        const userCreated = await repo.save(user);
        return userCreated;
      } catch (error: any) {
        if (error.extensions && error.extensions.invalidArgs === 'data.password') {
          const erroFormat = new MyError('Formato da senha inválido', error.extensions.code);
          console.log(erroFormat.getErrorDetails());
        } else if (error.extensions && error.extensions.invaldArgs === 'data.email') {
          const errorFormat = new MyError('Formato do email inválido', error.extensions.code);
          console.log(errorFormat.getErrorDetails());
        }
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

AppDataSourceTest.initialize()
  .then(() => {
    const port = 4001;
    console.log('Database conected');
    server.listen(port).then(({ url }) => {
      console.log(`Server running on port ${url}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
