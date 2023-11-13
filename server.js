const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

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

axios.post(apiUrl, {
  query: gqlMutation,
  variables,
}, {
  headers: {
    'Content-Type': 'application/json',
  },
}).then((response) => {
  console.log('Resposta do servidor:', response.data);
}).catch((error) => {
  console.error('Erro:', error);
});


const resolvers = {
  Query: {
    hello: () => 'Hello World!',
  },
  Mutation: {
    addUser: async (_, { name, email }) => {
    
    return { name, email };
  }
}}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 4000;
server.listen(port).then(({ url }) => {
  console.log(`Server running on port ${url}`);
});
