import { gql } from 'graphql-tag';
import { userSchema } from './user';
import { contactSchema } from './contact';


export const typeDefs = gql`
  ${userSchema}
  ${contactSchema}
`;