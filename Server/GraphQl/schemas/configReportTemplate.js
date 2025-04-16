const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type ConfigTemplate {
    _id: ID!
    clinicName: String!
    doctorName: String!
    logo: String
    mobile: String!
    headerName: String!
    subHeaderName: String!
    footer: String!
    signature1: String
    signature2: String
    userId: String!
    createdAt: String
  }

  input ConfigTemplateInput {
    clinicName: String!
    doctorName: String!
    mobile: String!
    headerName: String!
    subHeaderName: String!
    footer: String!
    userId: String!
    logo: String # ✅ Accept only URLs, not file uploads
    signature1: String
    signature2: String
  }
  type Query {
    getConfigTemplates(userId: ID!): [ConfigTemplate]
    getConfigTemplateById(id: ID!): ConfigTemplate
    getLatestConfigTemplate(userId: ID!): ConfigTemplate
  }

  type Mutation {
    addConfigTemplate(input: ConfigTemplateInput!): ConfigTemplate
    updateConfigTemplate(id: ID!, input: ConfigTemplateInput!): ConfigTemplate
    deleteConfigTemplate(id: ID!): String
  }
`;

module.exports = typeDefs;

// const { gql } = require("apollo-server-express");

// const typeDefs = gql`
//   type ConfigTemplate {
//     _id: ID!
//     clinicName: String!
//     doctorName: String!
//     logo: String
//     mobile: String!
//     headerName: String!
//     subHeaderName: String!
//     footer: String!
//     signature1: String
//     signature2: String
//     userId: String!
//     createdAt: String
//   }

//   input ConfigTemplateInput {
//     clinicName: String!
//     doctorName: String!
//     logo: String
//     mobile: String!
//     headerName: String!
//     subHeaderName: String!
//     footer: String!
//     signature1: String
//     signature2: String
//     userId: String!
//   }

// type Query {
//   getConfigTemplates(userId: ID!): [ConfigTemplate]
//   getConfigTemplateById(id: ID!): ConfigTemplate
//   getLatestConfigTemplate(userId: ID!): ConfigTemplate
// }

//   type Mutation {
//     addConfigTemplate(input: ConfigTemplateInput!): ConfigTemplate
// updateConfigTemplate(id: ID!, input: ConfigTemplateInput!): ConfigTemplate
// deleteConfigTemplate(id: ID!): String
//   }
// `;

// module.exports = typeDefs;
