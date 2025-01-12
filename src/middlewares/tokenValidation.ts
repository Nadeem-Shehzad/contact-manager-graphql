import { IncomingMessage } from 'http';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJWTPayload, MyContext } from '../utils/types';

export const context = async ({ req }: { req: IncomingMessage }): Promise<MyContext> => {
    const expressReq = req as Request; // Cast to express.Request
    const { authorization } = expressReq.headers;

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    if (authorization) {
        try {
            const token = authorization.startsWith('Bearer ')
                ? authorization.slice(7).trim()
                : authorization;

            const decoded = jwt.verify(token, secret) as CustomJWTPayload;

            return {
                userId: decoded.userId,
                email: decoded.email,
            };
        } catch (error) {
            //console.error('Token verification failed:', error instanceof Error ? error.message : 'Unknown error');
        }
    }

    return {};
};
