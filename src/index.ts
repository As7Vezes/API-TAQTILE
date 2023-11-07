import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';
import { UserInputError } from 'apollo-server-errors';
import bcrypt from 'bcrypt';

const typeDefs = gql`
  type User {
    id: ID
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

const resolvers = {
  Query: {
    users: async () => {
      const repo = AppDataSource.getRepository(User);
      const users = await repo.find();
      return users;
    },
  },
  Mutation: {
    createUser: async (_: any, { data }: { data: User }) => {
      const repo = AppDataSource.getRepository(User);

      const regexPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
      const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!regexEmail.test(data.email)) {
        throw new UserInputError('O campo email dever ser um email válido', {
          invaldArgs: ['data.email'],
        });
      }

      if (!regexPassword.test(data.password)) {
        throw new UserInputError('Senha deve ter pelo menos 6 caracteres e pelo menos uma letra e um número.', {
          invalidArgs: ['data.password'],
        });
      }

      const passwordHash = await bcrypt.hash(data.password, 10);

      const user = repo.create({
        name: data.name,
        email: data.email,
        password: passwordHash,
        birthData: data.birthData,
      });

      await repo.save(user);

      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

AppDataSource.initialize()
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
