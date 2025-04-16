import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../utils/env"; // Adjust the import path as necessary

// Async thunk to create a test report
export const createTestReport = createAsyncThunk(
  "testReport/create",
  async (reportData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/addTestReport`, reportData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk to get all patients with a testId
export const getAllPatientsWithTestId = createAsyncThunk(
  "patient/getAllWithTestId",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllPatientsWithTestId`);
      return response.data.patients;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

// Async thunk to get all test reports
export const getAllReports = createAsyncThunk(
  "testReport/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/getAllReports`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk to get a report by ID
export const getReportById = createAsyncThunk(
  "testReport/getById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/getReportById/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

// Async thunk to get reports by testId
export const getReportsByPatientId = createAsyncThunk(
  "testReport/getByTestId",
  async (patientId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/getReportByPatientId/${patientId}`
      );
      return response?.data || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "An error occurred"
      );
    }
  }
);

// Async thunk to update a report by ID
export const updateReport = createAsyncThunk(
  "testReport/updateById",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updateReport/${id}`,
        updateData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const testReportSlice = createSlice({
  name: "testReport",
  initialState: {
    testReports: [], // Store all reports
    testReport: null, // Store a single report (for details)
    testPatients: [], // Store all patients with testId
    status: "idle", // Loading status
    error: null, // Error status
  },
  reducers: {
    resetState: (state) => {
      state.testReport = null;
      state.testReports = [];
      state.testPatients = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createTestReport
      .addCase(createTestReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createTestReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.testReport = action.payload;
      })
      .addCase(createTestReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle getAllPatientsWithTestId
      .addCase(getAllPatientsWithTestId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPatientsWithTestId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.testPatients = action.payload;
      })
      .addCase(getAllPatientsWithTestId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle getAllReports
      .addCase(getAllReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.testReports = action.payload;
      })
      .addCase(getAllReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle getReportById
      .addCase(getReportById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReportById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.testReport = action.payload;
      })
      .addCase(getReportById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle getReportsByPatientId
      .addCase(getReportsByPatientId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getReportsByPatientId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.testReports = action.payload;
      })
      .addCase(getReportsByPatientId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Handle updateReport
      .addCase(updateReport.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.testReports.findIndex(
          (report) => report._id === action.payload._id
        );
        if (index !== -1) {
          state.testReports[index] = action.payload;
        } else {
          state.testReport = action.payload;
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the resetState action
export const { resetState } = testReportSlice.actions;

// Export the reducer for the slice
export default testReportSlice.reducer;
