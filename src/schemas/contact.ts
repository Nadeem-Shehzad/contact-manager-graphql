import {gql} from 'graphql-tag'

export const contactSchema = gql`

  # Define the Contact type (for queries)
  type Contact{
    id: ID!
    name:String!
    email:String!
    phone:String!
  }

  type PaginatedContacts{
    contacts: [Contact!]
    totalContacts: Int!
  }

  type Query {
    getContacts(page: Int!, limit: Int!): PaginatedContacts
    getContact(_id:ID!): Contact
  }

  # Define the Contact type (for mutation)
  input ContactInput{
    name:String!
    email:String!
    phone:String!
  }

  input ContactUpdateInput{
    name:String
    email:String
    phone:String
  }

  type Mutation {
    createContact(contact: ContactInput!): String
    updateContact(contactId: String!,contact: ContactUpdateInput!): String
    deleteContact(contactId: String): String
  }

`;