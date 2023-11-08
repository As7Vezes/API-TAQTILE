const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const gqlQuery = `query pokemons($limit: Int, $offset: Int) {
  pokemons(limit: $limit, offset: $offset) {
    count
    next
    previous
    status
    message
    results {
      url
      name
      image
    }
  }
}`;

const variables = {
  limit: 2,
  offset: 1,
};

const apiUrl = 'https://graphql-pokeapi.graphcdn.app/';

const urlComParametros = `${apiUrl}?query=${encodeURIComponent(gqlQuery)}&variables=${encodeURIComponent(JSON.stringify(variables))}`;

axios.get(urlComParametros)
  .then((response) => {

    console.log('Respota do servidor', response.data);

    return response
  })
  .catch((error) => {
    console.error('Erro:', error);
  });


const resolvers = {
  Query: {
    hello: () => 'Hello World!',
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 4000;
server.listen(port).then(({ url }) => {
  console.log(`Server running on port ${url}`);
});
