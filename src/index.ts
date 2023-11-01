/* eslint-disable @typescript-eslint/semi */
import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';

const typeDefs = gql`
  type User {
    id: ID
    name: String
    email: String
    birthData: String
    password: String
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
      const user = repo.create({
        name: data.name,
        email: data.email,
        password: data.password,
        birthData: data.birthData,
      });

      await repo.save(user);
      console.log(data);

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
    const port = 4000;
    console.log('Database conected');
    server.listen(port).then(({ url }) => {
      console.log(`Server running on port ${url}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
