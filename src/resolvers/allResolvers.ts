import {userResolver} from './user';
import { contactResolver } from './contact';

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