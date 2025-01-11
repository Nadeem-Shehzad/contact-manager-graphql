import { Query } from 'mongoose';
import User, { UserDocument } from '../models/user';
import { IUser } from '../utils/types';
import bcrypt from 'bcrypt';

export const userResolver = {
    Query: {
        getUsers: async (): Promise<IUser[]> => await User.find({}),
    },

    Mutation: {
        signUp: async (_: any, { userData }: { userData: IUser }): Promise<String> => {

            const user = await User.findOne({email: userData.email});

            if(user){
                throw new Error('User Already Exist!');
            }

            const hashedPassword = await bcrypt.hash(userData.password,10);

            const newUser = await User.create({
                ...userData,
                password: hashedPassword
            });

            return 'User SignedUp!';
        }
    }
};