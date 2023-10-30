import 'reflect-metadata';
import { ApolloServer, gql } from 'apollo-server';
import { AppDataSource } from './data-source';
import { User } from '../entities/User';

const typeDefs = gql`
  type User {
    id: ID
    name: String
  }

  type Mutation {
    createUser(name: String!): User
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
    createUser: async (_: any, args: any) => {
      const repo = AppDataSource.getRepository(User);

      const user = repo.create({
        name: args.name,
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
    console.log('Database conected');
    server.listen().then(({ url }) => {
      console.log(`Server running on port ${url}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
