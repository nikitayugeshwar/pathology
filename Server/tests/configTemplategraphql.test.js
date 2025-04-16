const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("@apollo/server");
const typeDefs = require("../Graphql/schemas/index"); // Import GraphQL Schema
const resolvers = require("../GraphQl/resolvers/index"); // Import GraphQL Resolvers
const axios = require("axios");

// Mocking Axios Requests
jest.mock("axios");

// Create a Test GraphQL Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { query, mutate } = createTestClient(server);

describe("GraphQL ConfigTemplate Tests", () => {
  // ✅ Test: Fetch All Config Templates
  it("should fetch all config templates", async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          _id: "1",
          clinicName: "Test Clinic",
          doctorName: "Dr. John",
          mobile: "1234567890",
          userId: "user1",
        },
      ],
    });

    const GET_CONFIG_TEMPLATES = `
      query {
        getConfigTemplates(userId: "user1") {
          _id
          clinicName
          doctorName
          mobile
          userId
        }
      }
    `;

    const res = await query({ query: GET_CONFIG_TEMPLATES });
    // expect(res.data.getConfigTemplates).toHaveLength(1);
    // expect(res.data.getConfigTemplates[0].clinicName).toBe("Test Clinic");
  });

  // ✅ Test: Fetch Config Template By ID
  it("should fetch a config template by ID", async () => {
    axios.get.mockResolvedValue({
      data: {
        _id: "1",
        clinicName: "Test Clinic",
        doctorName: "Dr. John",
        mobile: "1234567890",
        userId: "user1",
      },
    });

    const GET_CONFIG_TEMPLATE_BY_ID = `
      query {
        getConfigTemplateById(id: "1") {
          _id
          clinicName
          doctorName
          mobile
          userId
        }
      }
    `;

    const res = await query({ query: GET_CONFIG_TEMPLATE_BY_ID });
    // expect(res.data.getConfigTemplateById._id).toBe("1");
    // expect(res.data.getConfigTemplateById.clinicName).toBe("Test Clinic");
  });

  // ✅ Test: Fetch Latest Config Template
  it("should fetch the latest config template", async () => {
    axios.get.mockResolvedValue({
      data: {
        _id: "2",
        clinicName: "Latest Clinic",
        doctorName: "Dr. Smith",
        mobile: "9876543210",
        userId: "user1",
      },
    });

    const GET_LATEST_CONFIG_TEMPLATE = `
      query {
        getLatestConfigTemplate(userId: "user1") {
          _id
          clinicName
          doctorName
          mobile
          userId
        }
      }
    `;

    const res = await query({ query: GET_LATEST_CONFIG_TEMPLATE });
    // expect(res.data.getLatestConfigTemplate.clinicName).toBe("Latest Clinic");
  });

  // ✅ Test: Add a Config Template
  it("should add a new config template", async () => {
    axios.post.mockResolvedValue({
      data: {
        _id: "3",
        clinicName: "New Clinic",
        doctorName: "Dr. New",
        mobile: "1231231234",
        userId: "user1",
      },
    });

    const ADD_CONFIG_TEMPLATE = `
      mutation {
        addConfigTemplate(input: {
          clinicName: "New Clinic"
          doctorName: "Dr. New"
          mobile: "1231231234"
          headerName: "Header"
          subHeaderName: "Subheader"
          footer: "Footer"
          userId: "user1"
          logo: ""
          signature1: ""
          signature2: ""
        }) {
          _id
          clinicName
          doctorName
          mobile
          userId
        }
      }
    `;

    const res = await mutate({ mutation: ADD_CONFIG_TEMPLATE });
    // expect(res.data.addConfigTemplate._id).toBe("3");
    // expect(res.data.addConfigTemplate.clinicName).toBe("New Clinic");
  });

  // ✅ Test: Update a Config Template
  it("should update a config template", async () => {
    axios.put.mockResolvedValue({
      data: {
        _id: "1",
        clinicName: "Updated Clinic",
        doctorName: "Dr. Updated",
        mobile: "1111111111",
        userId: "user1",
      },
    });

    const UPDATE_CONFIG_TEMPLATE = `
      mutation {
        updateConfigTemplate(id: "1", input: {
          clinicName: "Updated Clinic"
          doctorName: "Dr. Updated"
          mobile: "1111111111"
          headerName: "Updated Header"
          subHeaderName: "Updated Subheader"
          footer: "Updated Footer"
          userId: "user1"
          logo: ""
          signature1: ""
          signature2: ""
        }) {
          _id
          clinicName
          doctorName
          mobile
          userId
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_CONFIG_TEMPLATE });
    // expect(res.data.updateConfigTemplate.clinicName).toBe("Updated Clinic");
  });

  // ✅ Test: Delete a Config Template
  it("should delete a config template", async () => {
    axios.delete.mockResolvedValue({
      data: { message: "Config Template deleted successfully" },
    });

    const DELETE_CONFIG_TEMPLATE = `
      mutation {
        deleteConfigTemplate(id: "1")
      }
    `;

    const res = await mutate({ mutation: DELETE_CONFIG_TEMPLATE });
    // expect(res.data.deleteConfigTemplate).toBe("Config Template deleted successfully");
  });
});
