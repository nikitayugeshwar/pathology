const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Test {
    id: String!
    name: String!
  }

  type Patient {
    id: ID
    patientNumber: Int!
    firstName: String!
    lastName: String
    contactNumber: String!
    email: String
    gender: String!
    age: Int!
    sampleCollector: String
    dateTime: String
    doctorName: String
    collectAt: String
    tests: [Test!]!
    address: String
    createdAt: String
    userId: String!
  }

  type Query {
    getAllPatients(userId: ID!): [Patient]
    getPatientById(id: ID!): Patient
    getPatientByTestId(testId: ID!): Patient
    getAllPatientsWithTestId(userId: ID!): [Patient]
    getDailyPatientCount(userId: ID!): Int
  }

  input AddPatientInput {
    firstName: String!
    lastName: String!
    contactNumber: String!
    email: String!
    gender: String!
    age: Int!
    sampleCollector: String!
    dateTime: String!
    doctorName: String!
    collectAt: String!
    tests: [TestInput]!
    address: String!
    userId: ID!
  }

  type UpdatePatientResponse {
    success: Boolean!
    message: String!
    patient: Patient
  }

  input UpdatePatientInput {
    patientNumber: Int
    firstName: String
    lastName: String
    contactNumber: String
    email: String
    gender: String
    age: Int
    sampleCollector: String
    dateTime: String
    doctorName: String
    collectAt: String
    address: String
    tests: [TestInput!]
    userId: ID
  }

  input TestInput {
    id: ID!
    name: String!
  }

  type Mutation {
    addPatient(input: AddPatientInput!): Patient
    updatePatient(id: ID!, input: UpdatePatientInput!): UpdatePatientResponse
    deletePatient(id: ID!): String
  }
`;

module.exports = typeDefs;
