const { ApolloServer } = require("apollo-server-express");
const { createTestClient } = require("apollo-server-testing");
const nock = require("nock");
const resolvers = require("../GraphQl/resolvers/index"); // Adjust path if needed
const typeDefs = require("../GraphQl/schemas/index"); // Adjust path if needed
const { gql } = require("apollo-server-express");

describe("GraphQL getTestReportsByPatientId Query", () => {
  let query;

  beforeAll(() => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const testClient = createTestClient(server);
    query = testClient.query;
  });

  afterEach(() => {
    nock.cleanAll(); // Clean up nock mocks
  });

  it("should fetch test reports by patient ID", async () => {
    const mockResponse = [
      {
        _id: "123",
        testName: "Blood Test",
        fields: [
          {
            fieldName: "Hemoglobin",
            results: "13.5",
            units: "g/dL",
            referenceRange: "12-16",
          },
        ],
      },
    ];

    nock("http://localhost:3000")
      .get("/getReportByPatientId/1")
      .reply(200, mockResponse);

    const GET_TEST_REPORTS_QUERY = gql`
      query GetTestReportsByPatientId($patientId: ID!) {
        getTestReportsByPatientId(patientId: $patientId) {
          id
          testName
          fields {
            fieldName
            results
            units
            referenceRange
          }
        }
      }
    `;

    const response = await query({
      query: GET_TEST_REPORTS_QUERY,
      variables: { patientId: "1" },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getTestReportsByPatientId).toEqual([
      {
        id: "123",
        testName: "Blood Test",
        fields: [
          {
            fieldName: "Hemoglobin",
            results: "13.5",
            units: "g/dL",
            referenceRange: "12-16",
          },
        ],
      },
    ]);
  });

  it("should return an error when the API request fails", async () => {
    nock("http://localhost:3000")
      .get("/getReportByPatientId/1")
      .reply(500, { message: "Internal Server Error" });

    const GET_TEST_REPORTS_QUERY = gql`
      query GetTestReportsByPatientId($patientId: ID!) {
        getTestReportsByPatientId(patientId: $patientId) {
          id
          testName
          fields {
            fieldName
            results
            units
            referenceRange
          }
        }
      }
    `;

    const response = await query({
      query: GET_TEST_REPORTS_QUERY,
      variables: { patientId: "1" },
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("Failed to fetch reports");
  });
});
