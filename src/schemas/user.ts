import { gql } from 'graphql-tag';

export const userSchema = gql`

  # for queries
  type User{
    id: ID!
    username:String!
    email:String!
    password:String!
  }

  type PaginatedUsers{
    users: [User!]
    totalUsers: Int!
  }

  type Query{
    getUsers(page:Int!,limit:Int!): PaginatedUsers
    getUser(id:ID!): User
  }


  # for mutation
  input UserInput{
    username:String!
    email:String!
    password:String!
  }

  input LoginInput{
    email:String!
    password:String!
  }

  type Mutation{
    signUp(userData:UserInput): String
    login(userData: LoginInput): String
  }  

`;