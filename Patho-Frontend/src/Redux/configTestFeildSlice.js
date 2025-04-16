import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch BASE_URL from the environment variable
import { BASE_URL } from "../utils/env"; // Adjust the import path as necessary
// Async action to add fields to a test
export const addFieldsToTest = createAsyncThunk(
  "test/addFieldsToTest",
  async ({ testId, fields, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/addTestFeild/${testId}`, // Use the dynamic BASE_URL
        { fields, userId } // Send the fields data
      );
      return response.data; // Return the response data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async action to get fields of a test by testId
export const getFieldsByTestId = createAsyncThunk(
  "test/getFieldsByTestId",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getTestFeildById/${testId}` // Use the dynamic BASE_URL
      );

      console.log("response", response);

      const fields = response.data.testReport?.fields || [];
      console.log("fields", fields);
      return fields;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async action to update fields by testId
export const updateFieldsByTestId = createAsyncThunk(
  "test/updateFieldsByTestId",
  async ({ testId, fields }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateTestFeild/${testId}`, // Use the dynamic BASE_URL
        { fields } // Send the updated fields data
      );
      return response.data.updatedFields; // Return the updated fields data
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const testSlice = createSlice({
  name: "test",
  initialState: {
    loading: false,
    successMessage: null,
    error: null,
    fields: [], // Add an initial state for test fields
  },
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle addFieldsToTest actions
      .addCase(addFieldsToTest.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
        state.error = null;
      })
      .addCase(addFieldsToTest.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Fields added successfully!";
      })
      .addCase(addFieldsToTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add fields";
      })

      // Handle getFieldsByTestId actions
      .addCase(getFieldsByTestId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFieldsByTestId.fulfilled, (state, action) => {
        state.loading = false;
        state.fields = action.payload; // Store the fetched test fields
      })
      .addCase(getFieldsByTestId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch test fields";
      })

      // Handle updateFieldsByTestId actions
      .addCase(updateFieldsByTestId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFieldsByTestId.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Fields updated successfully!";
        state.fields = action.payload; // Update the state with new fields data
      })
      .addCase(updateFieldsByTestId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update fields";
      });
  },
});

export const { clearMessage } = testSlice.actions;

export default testSlice.reducer;
