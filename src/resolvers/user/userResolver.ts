import { mSignUp, mLogin } from './userController';
import { qGetUsers, qGetUser } from './userController';


export const userResolver = {
    Query: {
        getUsers: qGetUsers,
        getUser: qGetUser
    },

    Mutation: {
        signUp: mSignUp,
        login: mLogin
    }
};