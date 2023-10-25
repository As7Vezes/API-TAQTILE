import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const typeDefs = `

    type Query {
        hello: String
    }

`;
const resolvers = {
    Query: {
        hello: () => 'Hello Mundão!'
    }
};
const server = new ApolloServer({
    typeDefs,
    resolvers
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
console.log('Server is Running!');
