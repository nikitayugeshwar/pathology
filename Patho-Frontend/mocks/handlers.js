import { graphql } from "msw";

export const handlers = [
  // Mock response for fetching all patients
  graphql.query("GetAllPatients", (req, res, ctx) => {
    return res(
      ctx.data({
        getAllPatients: [
          {
            id: "1",
            firstName: "John",
            lastName: "Doe",
            patientNumber: "P12345",
            contactNumber: "1234567890",
            gender: "Male",
            age: 30,
            tests: [{ name: "Blood Test" }],
          },
        ],
      })
    );
  }),

  graphql.query("GetPatientById", (req, res, ctx) => {
    return res(
      ctx.data({
        getPatientById: {
          id: "patient123",
          firstName: "John",
          lastName: "Doe",
          patientNumber: "P12345",
          contactNumber: "1234567890",
          gender: "Male",
          age: 30,
          sampleCollector: "Dr. Smith",
          email: "john@example.com",
          dateTime: "2024-03-28T10:00:00Z",
          doctorName: "Dr. House",
          collectAt: "Clinic A",
          address: "123 Health St.",
          tests: [{ name: "Blood Test" }],
        },
      })
    );
  }),

  graphql.mutation("AddPatient", (req, res, ctx) => {
    return res(
      ctx.data({
        addPatient: {
          id: "patient123",
          firstName: "John",
          lastName: "Doe",
          contactNumber: "9876543210",
          email: "john.doe@example.com",
          gender: "Male",
          age: 35,
          sampleCollector: "Dr. Smith",
          dateTime: "2025-04-01T12:00:00Z",
          doctorName: "Dr. Brown",
          collectAt: "Hospital",
          tests: [{ id: "test123", name: "Blood Test" }],
          address: "123 Main Street",
          userId: "user123",
        },
      })
    );
  }),

  // ✅ Mock API error
  graphql.mutation("AddPatient", (req, res, ctx) => {
    return res(ctx.errors([{ message: "GraphQL API error" }]));
  }),

  // ✅ Mock network failure
  graphql.mutation("AddPatient", (req, res) => {
    return res.networkError("Network connection failed");
  }),

  // Mock response for updating a patient
  graphql.mutation("UpdatePatient", (req, res, ctx) => {
    return res(
      ctx.data({
        updatePatient: {
          patient: {
            id: req.variables.id,
            firstName: req.variables.patientData.firstName,
            lastName: req.variables.patientData.lastName,
          },
          message: "Patient updated successfully",
        },
      })
    );
  }),

  // ✅ Mock GetPatientByTestId success response
  graphql.query("GetPatientByTestId", (req, res, ctx) => {
    return res(
      ctx.data({
        getPatientByTestId: {
          id: "patient123",
          firstName: "John",
          lastName: "Doe",
          patientNumber: "P12345",
        },
      })
    );
  }),

  graphql.query("GetAllPatientsWithTestId", (req, res, ctx) => {
    return res(
      ctx.data({
        getAllPatientsWithTestId: [
          {
            id: "patient123",
            firstName: "John",
            lastName: "Doe",
            patientNumber: "P12345",
            contactNumber: "9876543210",
            gender: "Male",
            age: 35,
            tests: [{ name: "Blood Test" }],
          },
          {
            id: "patient124",
            firstName: "Jane",
            lastName: "Smith",
            patientNumber: "P12346",
            contactNumber: "9876543211",
            gender: "Female",
            age: 28,
            tests: [{ name: "X-Ray" }],
          },
        ],
      })
    );
  }),

  // ✅ Mock API error
  graphql.query("GetAllPatientsWithTestId", (req, res, ctx) => {
    return res(ctx.errors([{ message: "GraphQL API error" }]));
  }),

  // ✅ Mock network failure
  graphql.query("GetAllPatientsWithTestId", (req, res) => {
    return res.networkError("Network connection failed");
  }),

  // ✅ Mock API error
  graphql.query("GetPatientByTestId", (req, res, ctx) => {
    return res(ctx.errors([{ message: "GraphQL API error" }]));
  }),

  // ✅ Mock network failure
  graphql.query("GetPatientByTestId", (req, res) => {
    return res.networkError("Network connection failed");
  }),

  // Mock response for deleting a patient
  graphql.mutation("DeletePatient", (req, res, ctx) => {
    return res(ctx.data({ deletePatient: "Patient deleted successfully" }));
  }),

  // ✅ Mock error response
  graphql.query("GetPatientById", (req, res, ctx) => {
    return res(
      ctx.errors([{ message: "GraphQL API error" }]) // Simulate error
    );
  }),

  // ✅ Mock network failure
  graphql.query("GetPatientById", (req, res) => {
    return res.networkError("Network connection failed");
  }),
];
