const { gql } = require("apollo-server-express");

const testReportTypeDefs = gql`
  type TestField {
    fieldName: String!
    results: String
    units: String
    referenceRange: String
  }

  type TestReport {
    id: ID!
    testName: String!
    fields: [TestField!]!
  }

  type Query {
    getTestReportsByPatientId(patientId: ID!): [TestReport] # ✅ Ensure this exists
  }
`;

module.exports = testReportTypeDefs;
