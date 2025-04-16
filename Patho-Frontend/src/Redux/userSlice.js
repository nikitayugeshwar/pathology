// userSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { BASE_URL } from "../utils/env"; // Adjust the import path as needed

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async () => {
    // Use the BASE_URL environment variable instead of hardcoding the URL
    const response = await axios.get(`${BASE_URL}/api/user`, {
      withCredentials: true,
    });

    return response.data.user;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    // other user states
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      state.userId = action.payload._id; // Assuming the user object has an _id field
      // Set other user states if needed
    });
  },
});

export default userSlice.reducer;
