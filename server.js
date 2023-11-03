const { ApolloServer, gql } = require('apollo-server');
const axios = require('axios');

const typeDefs = gql`
  type Query {
    hello: String
    fetchData: String
  }
`;

const resolvers = {
  Query: {
    fetchData: async () => {
      try {
        const response = await axios.get('http://localhost:4000/hello');
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    hello: () => 'Hello World!',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 4000;
server.listen(port).then(({ url }) => {
  console.log(`Server running on port ${url}`);
});
