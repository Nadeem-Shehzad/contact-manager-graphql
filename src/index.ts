import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';

import connectDB from './config/dbConnection';
import { typeDefs } from './schema/schema';
import { resolvers } from './resolver/resolver'

dotenv.config();
connectDB();

const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async (): Promise<void> => {
    try {
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4000 },
        });
        console.log(`🚀 Server ready at ${url}`);

    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();