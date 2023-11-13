import axios from 'axios';
import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server';
import { expect } from 'chai';

const typeDefs = gql`
  type Query {
    hello: String
  }

  type User {
    name: String
    email: String
  }

  type Mutation {
    addUser(name: String, email: String): User
  }
`;

const gqlMutation = `
  mutation addUser($name: String, $email: String) {
    addUser(name: $name, email: $email) {
      name
      email
    }
  }
`;

const variables = {
  name: 'Denys',
  email: 'denys@email.com',
};

const apiUrl = 'http://localhost:4000';
before(async () => {
  return await server.listen().then(({ url }) => {
    console.log(`Server is listening on ${url}`);
  });
});

describe('teste para conexão com o servidor Graphql', () => {
  it('deve retornar os dados do usuário com sucesso', async () => {
    const response = axios
      .post(
        apiUrl,
        {
          query: gqlMutation,
          variables,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        console.log('Resposta do servidor:', response.data);
        expect(response.data.data.addUser).to.be.deep.include(variables);
      })
      .catch((error) => {
        console.error('Erro:', error);
      });

    console.log(`Resposta do servidor: ${response}`);
  });
});

const resolvers = {
  Query: {
    hello: () => 'Hello World!',
  },
  Mutation: {
    addUser: async (_: any, { name, email }: any) => {
      return { name, email };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
