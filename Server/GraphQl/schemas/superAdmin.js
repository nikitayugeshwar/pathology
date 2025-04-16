const { gql } = require("apollo-server-express");

const superAdminTypeDefs = gql`
  type Superadmin {
    id: ID!
    userId: String!
    superAdminId: String!
    firstName: String!
    lastName: String!
    contactNumber: String!
    email: String!
    clinicName: String!
    userName: String!
    password: String!
    dateTime: String!
    address: String!
    active: Boolean!
    token: String
    refreshToken: String
    profileImage: String
    paymentStatus: String
    subscriptionExpiresAt: String
  }

  type AuthResponse {
    message: String!
    token: String
    refreshToken: String
  }

  input SuperadminInput {
    userId: String!
    superAdminId: String!
    firstName: String!
    lastName: String!
    contactNumber: String!
    email: String!
    clinicName: String!
    userName: String!
    password: String!
    dateTime: String!
    address: String!
  }

  type Query {
    getSuperadminById(id: ID!): Superadmin
    getAllSuperadmins(superAdminId: String!): [Superadmin]
  }

  type Mutation {
    createSuperadmin(input: SuperadminInput!): AuthResponse
    updateSuperadmin(id: ID!, input: SuperadminInput!): Superadmin
    deleteSuperadmin(id: ID!): String
    updateActiveStatus(id: ID!, active: Boolean!): Superadmin
  }
`;

module.exports = superAdminTypeDefs;
