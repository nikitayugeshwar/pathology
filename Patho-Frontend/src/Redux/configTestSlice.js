import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../utils/env"; // Adjust the import path as needed

// Async action to add a test
export const addTest = createAsyncThunk(
  "test/addTest",
  async (testData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_URL}/addTest`, testData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to get all tests
export const getAllTests = createAsyncThunk(
  "tests/getAllTests",
  async ({ rejectWithValue }) => {
    try {
      console.log("gettin aall test names");
      const response = await axios.get(`${BASE_URL}/api/tests`); // Use the correct API endpoint
      console.log("response from the test names", response);
      return response.data.tests; // Adjust to match the API response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tests"
      );
    }
  }
);
// Async action to get a test by ID
export const getTestById = createAsyncThunk(
  "test/getTestById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/getTestById/${id}`);
      return response.data.test; // Assuming the response contains the test data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to update a test
export const updateTest = createAsyncThunk(
  "test/updateTest",
  async ({ id, testName, fields }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/updateTest/${id}`, {
        testName,
        fields, // Send an object containing testName and fields
      });
      return response.data.test; // Assuming the response contains the updated test data
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to delete a test
export const deleteTest = createAsyncThunk(
  "test/deleteTest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deleteTest/${id}`);
      return { id, message: response.data.message }; // Assuming the response contains a success message
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to add fields to a test
export const addFieldsToTest = createAsyncThunk(
  "test/addFieldsToTest",
  async ({ testId, fields }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addTestFeild/${testId}`,
        { fields } // Sending the fields in the request body
      );
      return response.data; // Assuming the response contains the success message and updated test fields
    } catch (error) {
      return rejectWithValue(error.response.data); // Handle error
    }
  }
);

const testSlice = createSlice({
  name: "test",
  initialState: {
    tests: [],
    test: {}, // State for a single test
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
      // Add a test
      .addCase(addTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Assuming response includes a success message
        state.tests.push(action.payload.test); // Assuming response includes the newly created test
      })
      .addCase(addTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // Capture the error message
      })
      // Get all tests
      .addCase(getAllTests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload; // Store the fetched tests
      })
      .addCase(getAllTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action?.payload?.message || []; // Capture error message
      })
      // Get test by ID
      .addCase(getTestById.fulfilled, (state, action) => {
        state.test = action.payload; // Set the fetched test
      })
      // Update test
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Assuming response includes a success message
        const index = state.tests.findIndex(
          (test) => test._id === action.payload.test._id
        );
        if (index !== -1) {
          state.tests[index] = action.payload.test; // Update the test in the state
        }
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // Capture error message
      })
      // Delete test
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message; // Assuming response includes a success message
        state.tests = state.tests.filter(
          (test) => test._id !== action.payload.id
        ); // Remove the deleted test
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message; // Capture error message
      })
      // Add fields to a test
      .addCase(addFieldsToTest.pending, (state) => {
        state.loading = true; // Set loading to true when the request is pending
      })
      .addCase(addFieldsToTest.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the request is fulfilled
        state.successMessage = action.payload.message; // Set success message
        // Optionally, you can update your tests state if needed
      })
      .addCase(addFieldsToTest.rejected, (state, action) => {
        state.loading = false; // Set loading to false when the request is rejected
        state.error = action.payload.message; // Capture the error message
      });
  },
});

export const { clearMessage } = testSlice.actions;
export default testSlice.reducer; // This will be imported as testManagementReducer
