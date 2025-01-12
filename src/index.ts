import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import dotenv from 'dotenv';
import { Request } from 'express';
import { IncomingMessage } from 'http';
import connectDB from './config/dbConnection';
import { typeDefs } from './schemas/allSchemas';
import { resolvers } from './resolvers/allResolvers';
import { context } from './middlewares/tokenValidation';
import { MyContext } from './utils/types';

dotenv.config();
connectDB();

const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers
});

const startServer = async (): Promise<void> => {
    try {
        const { url } = await startStandaloneServer(server, {
            context: async ({ req }: { req: IncomingMessage }): Promise<MyContext> => {
                const contextData = await context({ req });
                return {
                    userId: contextData.userId,
                    email: contextData.email
                };
            },
            listen: { port: 4000 },
        });
        console.log(`🚀 Server ready at ${url}`);

    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();