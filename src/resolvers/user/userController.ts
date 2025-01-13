import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserDocument } from '../../models/user';
import { IUser } from '../../utils/types';
import { ILogin } from '../../utils/types'


import Redis from 'ioredis';



const redisClient = new Redis();
redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
    // Check if Redis client is already connected
    if (redisClient.status !== 'ready') {  // 'ready' means the connection is fully established
        try {
            await redisClient.connect(); // Only connect if not already connected
            console.log('Connected to Redis');
        } catch (err) {
            // console.error('Failed to connect to Redis:', err);
            console.log(`connecting error...`);
        }
    }
})();


export const mSignUp = async (_: any, { userData }: { userData: IUser }): Promise<String> => {

    const user = await User.findOne({ email: userData.email });

    if (user) {
        throw new Error('User Already Exist!');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = await User.create({
        ...userData,
        password: hashedPassword
    });

    return 'User SignedUp!';
}


export const mLogin = async (_: any, { userData }: { userData: ILogin }): Promise<String> => {
    const user = await User.findOne({ email: userData.email });
    if (!user) {
        throw new Error('User not registered!');
    }

    const passwordMatched = await bcrypt.compare(userData.password, user.password);
    if (!passwordMatched) {
        throw new Error('Invalid Password!');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }

    const token = jwt.sign({
        userId: user._id,
        email: user.email
    }, secret, { expiresIn: '1h' });

    return token;
}


export const qGetUsers = async (_: any, { page, limit }: { page: number, limit: number })
    : Promise<{ users: IUser[], totalUsers: number }> => {

    const users = await User.find({}).skip((page - 1) * limit).limit(limit);
    const totalUsers = users.length;

    const key: string = `getUsers:${page}:${limit}`;

    const cachedData = await redisClient.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    await redisClient.set(key, JSON.stringify({ users, totalUsers }), 'EX', 3600);

    return { users, totalUsers };
};


export const qGetUser = async (_: any, { id }: { id: String }): Promise<IUser> => {

    const key = `getUser:${id}`;
    const cachedData = await redisClient.get(key);
    if (cachedData) {
        return JSON.parse(cachedData);
    }

    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found!');
    }

    await redisClient.set(key, JSON.stringify(user), 'EX', 3600);

    return user;
}