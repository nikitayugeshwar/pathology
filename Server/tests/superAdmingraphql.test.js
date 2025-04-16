const { ApolloServer } = require("apollo-server-express");
const { createTestClient } = require("apollo-server-testing");
const nock = require("nock");
const resolvers = require("../GraphQl/resolvers/superadminResolver"); // Adjust path if needed
const typeDefs = require("../GraphQl/schemas/superAdmin"); // Adjust path if needed
const { gql } = require("apollo-server-express");

describe("GraphQL Superadmin Resolvers", () => {
  let query, mutate;
  const BASE_URL = "http://localhost:5000/api/superadmin";

  beforeAll(() => {
    const server = new ApolloServer({ typeDefs, resolvers });
    const testClient = createTestClient(server);
    query = testClient.query;
    mutate = testClient.mutate;
  });

  afterEach(() => {
    nock.cleanAll(); // Clean up nock mocks
  });

  it("should fetch a superadmin by ID", async () => {
    const mockResponse = {
      id: "123",
      userId: "U001",
      superAdminId: "SA001",
      firstName: "John",
      lastName: "Doe",
      contactNumber: "1234567890",
      email: "john.doe@example.com",
      clinicName: "Health Clinic",
      userName: "johndoe",
      password: "hashedpassword",
      dateTime: "2023-03-15T12:00:00Z",
      address: "123 Main St",
      active: true,
      token: "token123",
      refreshToken: "refreshToken123",
    };

    nock(BASE_URL).get("/123").reply(200, mockResponse);

    const GET_SUPERADMIN_QUERY = gql`
      query GetSuperadminById($id: ID!) {
        getSuperadminById(id: $id) {
          id
          firstName
          lastName
          email
        }
      }
    `;

    const response = await query({
      query: GET_SUPERADMIN_QUERY,
      variables: { id: "123" },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.getSuperadminById).toEqual({
      id: "123",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    });
  });

  it("should create a superadmin", async () => {
    const mockInput = {
      userId: "U002",
      superAdminId: "SA002",
      firstName: "Jane",
      lastName: "Doe",
      contactNumber: "9876543210",
      email: "jane.doe@example.com",
      clinicName: "Wellness Center",
      userName: "janedoe",
      password: "securepassword",
      dateTime: "2023-03-15T12:00:00Z",
      address: "456 Elm St",
    };

    const mockResponse = {
      message: "Superadmin created successfully",
      token: "newToken123",
      refreshToken: "newRefreshToken123",
    };

    nock(BASE_URL).post("/create", mockInput).reply(200, mockResponse);

    const CREATE_SUPERADMIN_MUTATION = gql`
      mutation CreateSuperadmin($input: SuperadminInput!) {
        createSuperadmin(input: $input) {
          message
          token
          refreshToken
        }
      }
    `;

    const response = await mutate({
      mutation: CREATE_SUPERADMIN_MUTATION,
      variables: { input: mockInput },
    });

    expect(response.errors).toBeUndefined();
    expect(response.data.createSuperadmin).toEqual(mockResponse);
  });

  it("should return an error when fetching a superadmin fails", async () => {
    nock(BASE_URL).get("/999").reply(404, { error: "Superadmin not found" });

    const GET_SUPERADMIN_QUERY = gql`
      query GetSuperadminById($id: ID!) {
        getSuperadminById(id: $id) {
          id
          firstName
          lastName
          email
        }
      }
    `;

    const response = await query({
      query: GET_SUPERADMIN_QUERY,
      variables: { id: "999" },
    });

    expect(response.errors).toBeDefined();
    expect(response.errors[0].message).toBe("Superadmin not found");
  });
});
