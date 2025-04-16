import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../graphql/client"; // Import Apollo Client

// GraphQL Queries & Mutations
const GET_ALL_PATIENTS = gql`
  query GetAllPatients($userId: ID!) {
    getAllPatients(userId: $userId) {
      id
      firstName
      lastName
      patientNumber
      tests {
        name
      }
      contactNumber
      gender
      age
      sampleCollector
    }
  }
`;

const GET_PATIENT_BY_ID = gql`
  query GetPatientById($id: ID!) {
    getPatientById(id: $id) {
      id
      firstName
      lastName
      patientNumber
      contactNumber
      gender
      age
      sampleCollector
      email
      dateTime
      doctorName
      collectAt
      address
      tests {
        name
      }
    }
  }
`;

const GET_PATIENT_BY_TEST_ID = gql`
  query GetPatientByTestId($testId: ID!) {
    getPatientByTestId(testId: $testId) {
      id
      firstName
      lastName
      patientNumber
    }
  }
`;

const GET_ALL_PATIENTS_WITH_TEST_ID = gql`
  query GetAllPatientsWithTestId($userId: ID!) {
    getAllPatientsWithTestId(userId: $userId) {
      id
      patientNumber
      firstName
      lastName
      contactNumber
      gender
      age
      tests {
        name
      }
    }
  }
`;

const ADD_PATIENT = gql`
  mutation AddPatient($input: AddPatientInput!) {
    addPatient(input: $input) {
      id
      firstName
      lastName
      contactNumber
      email
      gender
      age
      sampleCollector
      dateTime
      doctorName
      collectAt
      tests {
        id
        name
      }
      address
      userId
    }
  }
`;

const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
    updatePatient(id: $id, input: $input) {
      success
      message
      patient {
        id
        patientNumber
        firstName
        lastName
        contactNumber
        email
        gender
        age
        sampleCollector
        dateTime
        doctorName
        collectAt
        address
        tests {
          id
          name
        }
        userId
      }
    }
  }
`;

const DELETE_PATIENT = gql`
  mutation DeletePatient($id: ID!) {
    deletePatient(id: $id)
  }
`;

// Async Thunks using GraphQL

export const getAllPatientsByUserId = createAsyncThunk(
  "patient/getAllPatientsByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_ALL_PATIENTS,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      return data.getAllPatients;
    } catch (error) {
      console.error("Error fetching patients:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getPatientById = createAsyncThunk(
  "patient/getPatientById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_PATIENT_BY_ID,
        variables: { id },
      });
      return data.getPatientById;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPatientByTestId = createAsyncThunk(
  "patient/getPatientByTestId",
  async (testId, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_PATIENT_BY_TEST_ID,
        variables: { testId },
      });
      return data.getPatientByTestId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async action to get patients with a specific testId
export const getPatientsWithTestId = createAsyncThunk(
  "patient/getPatientsWithTestId",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_ALL_PATIENTS_WITH_TEST_ID,
        variables: { userId },
      });

      return data.getAllPatientsWithTestId; // Return fetched patients
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPatient = createAsyncThunk(
  "patient/addPatient",
  async (patientData, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_PATIENT,
        variables: { input: patientData }, // ✅ Correct: `input` instead of `patientData`
      });

      console.log("Data:", data);
      return data.addPatient;
    } catch (error) {
      console.error("GraphQL Error:", error);
      return rejectWithValue(error.message || "Failed to add patient");
    }
  }
);

export const updatePatient = createAsyncThunk(
  "patient/updatePatient",
  async ({ id, patientData }, { rejectWithValue }) => {
    try {
      console.log("Sending update request for ID:", id);
      console.log("Patient data being sent:", patientData);

      // Ensure all required fields are included and properly formatted
      const input = {
        patientNumber: parseInt(patientData.patientNumber) || 0,
        firstName: patientData.firstName || "",
        lastName: patientData.lastName || "",
        contactNumber: patientData.contactNumber || "",
        email: patientData.email || "",
        gender: patientData.gender || "",
        age: parseInt(patientData.age) || 0,
        sampleCollector: patientData.sampleCollector || "",
        dateTime: patientData.dateTime || new Date().toISOString(),
        doctorName: patientData.doctorName || "",
        collectAt: patientData.collectAt || new Date().toISOString(),
        address: patientData.address || "",
        tests:
          patientData.tests?.map((test) => ({
            id: test.id || "",
            name: test.name || "",
          })) || [],
        userId: patientData.userId || "",
      };

      const { data } = await client.mutate({
        mutation: UPDATE_PATIENT,
        variables: {
          id,
          input,
        },
      });

      if (!data?.updatePatient?.success) {
        throw new Error(data?.updatePatient?.message || "Update failed");
      }

      return data.updatePatient;
    } catch (error) {
      console.error("Update error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const deletePatient = createAsyncThunk(
  "patient/deletePatient",
  async (id, { rejectWithValue }) => {
    try {
      console.log("🟢 Sending delete request for ID:", id);
      console.log("📡 Sending GraphQL Request...");

      if (!id) {
        throw new Error("❌ ID is missing before sending GraphQL request");
      }

      const { data } = await client.mutate({
        mutation: DELETE_PATIENT,
        variables: { id: String(id) }, // 🔥 Ensure ID is a string
      });

      console.log("✅ Delete Mutation Response:", data);

      return { id, message: data.deletePatient.message };
    } catch (error) {
      console.error("❌ GraphQL Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const patientSlice = createSlice({
  name: "patient",
  initialState: {
    patients: [],
    patient: {},
    patientsWithTestId: [],
    patientsByTestId: {},
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPatientsByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPatientsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(getAllPatientsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPatientById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload;
      })
      .addCase(getPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPatientByTestId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientByTestId.fulfilled, (state, action) => {
        state.loading = false;
        state.patientsByTestId = action.payload;
      })
      .addCase(getPatientByTestId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch patients with a specific testId
      .addCase(getPatientsWithTestId.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPatientsWithTestId.fulfilled, (state, action) => {
        state.loading = false;
        state.patientsWithTestId = action.payload; // Store patients in new state
      })
      .addCase(getPatientsWithTestId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      .addCase(addPatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPatient.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // ✅ Ensure successMessage is always set
          state.successMessage = "Patient added successfully";
          state.patients.push(action.payload);
        }
      })

      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;

        // Update the patient in the patients array
        const updatedPatient = action.payload.patient;
        state.patients = state.patients.map((patient) =>
          patient.id === updatedPatient.id ? updatedPatient : patient
        );

        // Also update the current patient if it's the one being edited
        if (state.patient?.id === updatedPatient.id) {
          state.patient = updatedPatient;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.patients = state.patients.filter(
          (p) => p.id !== action.payload.id
        );
      })

      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessage } = patientSlice.actions;
export default patientSlice.reducer;
