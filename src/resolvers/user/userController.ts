import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { UserDocument } from '../../models/user';
import { IUser } from '../../utils/types';
import { ILogin } from '../../utils/types'


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

export const qGetUsers = async (): Promise<IUser[]> => {
    return await User.find({})
};

export const qGetUser = async (_: any, { id }: { id: String }): Promise<IUser> => {
    const user = await User.findById(id);
    if(!user){
        throw new Error('User not found!');
    }

    return user;
}