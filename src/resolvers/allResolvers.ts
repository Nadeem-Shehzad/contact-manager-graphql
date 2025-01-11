import {userResolver} from './user/userResolver';
import { contactResolver } from './contact/contactResolver';

export const resolvers = {
  Query: {
    ...userResolver.Query,
    ...contactResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...contactResolver.Mutation,
  },
};