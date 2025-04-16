const { createTestClient } = require("apollo-server-testing");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("../GraphQl/schemas"); // Import your schema
const resolvers = require("../GraphQl/resolvers"); // Import resolvers
const axios = require("axios");

// ✅ Mock External Dependencies (Axios)
jest.mock("axios");

// ✅ Create Test Server
const server = new ApolloServer({ typeDefs, resolvers });
const { query, mutate } = createTestClient(server);

describe("GraphQL API Tests", () => {
  // ✅ Test: Fetch All Patients
  it("should fetch all patients", async () => {
    axios.get.mockResolvedValue({
      data: { patients: [{ id: "1", firstName: "John", lastName: "Doe" }] },
    });

    const GET_PATIENTS = `
      query {
        getAllPatients(userId: "userIdHere") {
          id
          firstName
          lastName
        }
      }
    `;

    const res = await query({ query: GET_PATIENTS });
    expect(res.data.getAllPatients).toHaveLength(1);
    expect(res.data.getAllPatients[0].firstName).toBe("John");
  });

  // ✅ Test: Fetch Patient By ID
  it("should fetch a patient by ID", async () => {
    axios.get.mockResolvedValue({
      data: { patient: { id: "1", firstName: "John", lastName: "Doe" } },
    });

    const GET_PATIENT_BY_ID = `
      query {
        getPatientById(id: "1") {
          id
          firstName
          lastName
        }
      }
    `;

    const res = await query({ query: GET_PATIENT_BY_ID });
    expect(res.data.getPatientById).toHaveProperty("id", "1");
    expect(res.data.getPatientById.firstName).toBe("John");
  });

  // ✅ Test: Add a Patient
  it("should add a new patient", async () => {
    axios.post.mockResolvedValue({
      data: { patient: { id: "2", firstName: "Jane", lastName: "Doe" } },
    });

    const ADD_PATIENT = `
      mutation {
        addPatient(input: {
          firstName: "Jane"
          lastName: "Doe"
          contactNumber: "1234567890"
          email: "jane.doe@example.com"
          gender: "Female"
          age: 25
          sampleCollector: "Collector Name"
          dateTime: "2025-03-25T10:00:00Z"
          doctorName: "Dr. Smith"
          collectAt: "Clinic A"
          tests: [{ id: "testId1", name: "Blood Test" }]
          address: "123 Street, City"
          userId: "userIdHere"
        }) {
          id
          firstName
        }
      }
    `;

    const res = await mutate({ mutation: ADD_PATIENT });
    expect(res.data.addPatient.id).toBe("2");
    expect(res.data.addPatient.firstName).toBe("Jane");
  });

  // ✅ Test: Update a Patient
  it("should update a patient's details", async () => {
    axios.put.mockResolvedValue({
      data: { patient: { id: "1", firstName: "Updated Name" } },
    });

    const UPDATE_PATIENT = `
      mutation {
        updatePatient(id: "1", input: {
          firstName: "Updated Name"
        }) {
          id
          firstName
        }
      }
    `;

    const res = await mutate({ mutation: UPDATE_PATIENT });
    expect(res.data.updatePatient.firstName).toBe("Updated Name");
  });

  // ✅ Test: Delete a Patient
  it("should delete a patient", async () => {
    axios.delete.mockResolvedValue({
      data: { message: "Patient deleted successfully" },
    });

    const DELETE_PATIENT = `
      mutation {
        deletePatient(id: "1")
      }
    `;

    const res = await mutate({ mutation: DELETE_PATIENT });
    expect(res.data.deletePatient).toBe("Patient deleted successfully");
  });
});
