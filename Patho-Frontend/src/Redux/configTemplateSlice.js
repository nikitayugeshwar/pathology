import { gql } from "@apollo/client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import client from "../graphql/client"; // Import Apollo Client

// GraphQL Queries & Mutations
const GET_CONFIG_TEMPLATES = gql`
  query GetConfigTemplates($userId: ID!) {
    getConfigTemplates(userId: $userId) {
      _id
      clinicName
    }
  }
`;

const ADD_CONFIG_TEMPLATE = gql`
  mutation AddConfigTemplate($input: ConfigTemplateInput!) {
    addConfigTemplate(input: $input) {
      _id
      clinicName
      doctorName
      mobile
      headerName
      subHeaderName
      footer
      logo
      signature1
      signature2
      userId
    }
  }
`;

export const UPDATE_CONFIG_TEMPLATE = gql`
  mutation UpdateConfigTemplate($id: ID!, $input: ConfigTemplateInput!) {
    updateConfigTemplate(id: $id, input: $input) {
      _id
      clinicName
      doctorName
      mobile
      headerName
      subHeaderName
      footer
      logo
      signature1
      signature2
      userId
    }
  }
`;

export const DELETE_CONFIG_TEMPLATE = gql`
  mutation DeleteConfigTemplate($id: ID!) {
    deleteConfigTemplate(id: $id)
  }
`;

export const GET_LATEST_CONFIG_TEMPLATE = gql`
  query GetLatestConfigTemplate($userId: ID!) {
    getLatestConfigTemplate(userId: $userId) {
      _id
      clinicName
      doctorName
      mobile
      headerName
      subHeaderName
      footer
      logo
      signature1
      signature2
    }
  }
`;

export const GET_CONFIG_TEMPLATE_BY_ID = gql`
  query GetConfigTemplateById($id: ID!) {
    getConfigTemplateById(id: $id) {
      _id
      clinicName
      doctorName
      mobile
      headerName
      subHeaderName
      footer
    }
  }
`;

// Async Thunks using GraphQL
export const fetchConfigTemplates = createAsyncThunk(
  "configTemplate/fetchConfigTemplates",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      console.error("🚨 userId is undefined in fetchConfigTemplates!");
      return rejectWithValue("User ID is missing");
    }

    try {
      const { data } = await client.query({
        query: GET_CONFIG_TEMPLATES,
        variables: { userId },
        fetchPolicy: "network-only",
      });

      return data.getConfigTemplates;
    } catch (error) {
      console.error("❌ GraphQL Query Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const getLatestConfigTemplate = createAsyncThunk(
  "configTemplate/getLatestConfigTemplate",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await client.query({
        query: GET_LATEST_CONFIG_TEMPLATE,
        variables: { userId },
      });

      return data.getLatestConfigTemplate;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteConfigTemplate = createAsyncThunk(
  "configTemplate/deleteConfigTemplate",
  async (id, { rejectWithValue }) => {
    try {
      console.log("📤 Sending ID to GraphQL:", id); // Debugging
      const { data } = await client.mutate({
        mutation: DELETE_CONFIG_TEMPLATE,
        variables: { id },
      });
      return { id, message: data.deleteConfigTemplate.message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addConfigTemplate = createAsyncThunk(
  "configTemplate/addConfigTemplate",
  async (input, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: ADD_CONFIG_TEMPLATE,
        variables: { input }, // ✅ Send JSON instead of FormData
      });

      return data.addConfigTemplate;
    } catch (error) {
      console.error("❌ GraphQL Mutation Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

// export const addConfigTemplate = createAsyncThunk(
//   "configTemplate/addConfigTemplate",
//   async (input, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();

//       for (const key in input) {
//         formData.append(key, input[key]);
//       }

//       console.log("📤 Sending FormData:", formData);

//       const { data } = await client.mutate({
//         mutation: ADD_CONFIG_TEMPLATE,
//         variables: { input: formData },
//       });

//       console.log("✅ GraphQL Response:", data);
//       return data.addConfigTemplate;
//     } catch (error) {
//       console.error("❌ GraphQL Mutation Error:", error);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const updateConfigTemplate = createAsyncThunk(
  "configTemplate/updateConfigTemplate",
  async ({ id, input }, { rejectWithValue }) => {
    try {
      const { data } = await client.mutate({
        mutation: UPDATE_CONFIG_TEMPLATE,
        variables: { id, input },
      });
      return data.updateConfigTemplate;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getConfigTemplateById = createAsyncThunk(
  "configTemplate/getConfigTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      console.log("📤 Sending ID to GraphQL:", id); // Debugging
      const { data } = await client.query({
        query: GET_CONFIG_TEMPLATE_BY_ID,
        variables: { id },
      });
      console.log("✅ GraphQL Response:", data);
      return data.getConfigTemplateById;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Redux Slice
const configTemplateSlice = createSlice({
  name: "configTemplate",
  initialState: {
    configTemplates: [],
    configTemplate: null,
    latestConfigTemplate: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    resetSuccess: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConfigTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.configTemplates = action.payload;
      })
      .addCase(fetchConfigTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLatestConfigTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLatestConfigTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.latestConfigTemplate = action.payload;
      })
      .addCase(getLatestConfigTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get config template by ID
      .addCase(getConfigTemplateById.pending, (state) => {
        state.loading = true; // Set loading to true when the request is initiated
        state.error = null; // Reset any previous error
      })
      .addCase(getConfigTemplateById.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when the request is completed
        state.configTemplate = action.payload; // Store the fetched config template by ID
      })
      .addCase(getConfigTemplateById.rejected, (state, action) => {
        state.loading = false; // Set loading to false when the request fails
        state.error = action.payload; // Capture the error message
      })

      .addCase(addConfigTemplate.pending, (state) => {
        state.loading = true;
        state.successMessage = null;
      })
      .addCase(addConfigTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Config template added successfully";
        state.configTemplates.push(action.payload);
      })
      .addCase(addConfigTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateConfigTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateConfigTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Config template updated successfully";
        const index = state.configTemplates.findIndex(
          (template) => template._id === action.payload._id
        );
        if (index !== -1) {
          state.configTemplates[index] = action.payload;
        }
      })
      .addCase(updateConfigTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete a config template
      .addCase(deleteConfigTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteConfigTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.configTemplates = state.configTemplates.filter(
          (template) => template._id !== action.payload.configTemplateId
        ); // Remove the deleted template
      })
      .addCase(deleteConfigTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSuccess } = configTemplateSlice.actions;
export default configTemplateSlice.reducer;

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Async action to add a config template
// export const addConfigTemplate = createAsyncThunk(
//   "configTemplate/addConfigTemplate",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/configTemplate`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data", // Important for file uploads
//           },
//         }
//       );
//       return response.data; // Assuming the response contains the newly created config template
//     } catch (error) {
//       return rejectWithValue(error.response.data); // Capture any error message from the server
//     }
//   }
// );

// // Async action to update a config template by ID
// export const updateConfigTemplate = createAsyncThunk(
//   "configTemplate/updateConfigTemplate",
//   async ({ id, formData }, { rejectWithValue }) => {
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/updateConfigTemplate/${id}`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       return response.data; // Assuming the response contains the updated config template
//     } catch (error) {
//       return rejectWithValue(error.response.data); // Capture any error message from the server
//     }
//   }
// );

// // Async action to fetch a config template by ID
// export const getConfigTemplateById = createAsyncThunk(
//   "configTemplate/getConfigTemplateById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/getConfigTemplateById/${id}`
//       );
//       return response.data; // Assuming the response contains the requested config template
//     } catch (error) {
//       return rejectWithValue(error.response.data); // Capture any error message from the server
//     }
//   }
// );

// // Async action to fetch all config templates (reports)
// export const fetchConfigTemplates = createAsyncThunk(
//   "configTemplate/fetchConfigTemplatesByUserId",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BASE_URL}/configTemplates/${userId}`);
//       return response.data; // Assuming the response contains an array of templates
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Async action to delete a config template by ID
// export const deleteConfigTemplate = createAsyncThunk(
//   "configTemplate/deleteConfigTemplate",
//   async (id, { rejectWithValue }) => {
//     try {
//       const response = await axios.delete(
//         `${BASE_URL}/deleteConfigTemplate/${id}`
//       );
//       return response.data; // Assuming the response contains the deleted template info
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // // Async action to fetch a config template by patient ID
// // export const getConfigTemplateByPatientId = createAsyncThunk(
// //   "configTemplate/getConfigTemplateByPatientId",
// //   async (patientId, { rejectWithValue }) => {
// //     try {
// //       const response = await axios.get(`${BASE_URL}/getConfigTemplateByPatientId/${patientId}`);
// //       return response.data; // Assuming the response contains the requested config templates
// //     } catch (error) {
// //       return rejectWithValue(error.response.data); // Capture any error message from the server
// //     }
// //   }
// // );

// export const getLatestConfigTemplate = createAsyncThunk(
//   "configTemplate/getLatestConfigTemplate",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/latestConfigTemplate/${userId}`
//       );
//       console.log("response", response.data);
//       return response.data; // Assuming the response contains the latest config template
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message); // Capture any error message from the server
//     }
//   }
// );

// // Create the slice
// const configTemplateSlice = createSlice({
//   name: "configTemplate",
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//     configTemplate: null,
//     configTemplates: [], // For storing fetched templates (reports)
//   },
//   reducers: {
//     resetSuccess: (state) => {
//       state.success = false; // Reset success state
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Add a config template
//       .addCase(addConfigTemplate.pending, (state) => {
//         state.loading = true; // Set loading to true when the request is initiated
//         state.success = false; // Reset success
//         state.error = null; // Reset any previous error
//       })
//       .addCase(addConfigTemplate.fulfilled, (state, action) => {
//         state.loading = false; // Set loading to false when the request is completed
//         state.success = true; // Set success to true
//         state.configTemplate = action.payload; // Store the newly created config template
//       })
//       .addCase(addConfigTemplate.rejected, (state, action) => {
//         state.loading = false; // Set loading to false when the request fails
//         state.success = false; // Set success to false
//         state.error = action.payload; // Capture the error message
//       })

//       // Update a config template
//       .addCase(updateConfigTemplate.pending, (state) => {
//         state.loading = true; // Set loading to true when the update request is initiated
//         state.success = false; // Reset success
//         state.error = null; // Reset any previous error
//       })
//       .addCase(updateConfigTemplate.fulfilled, (state, action) => {
//         state.loading = false; // Set loading to false when the update request is completed
//         state.success = true; // Set success to true
//         const index = state.configTemplates.findIndex(
//           (template) => template._id === action.payload.configTemplate._id
//         );
//         if (index !== -1) {
//           state.configTemplates[index] = action.payload.configTemplate; // Replace the updated template
//         }
//       })
//       .addCase(updateConfigTemplate.rejected, (state, action) => {
//         state.loading = false; // Set loading to false when the update request fails
//         state.success = false; // Set success to false
//         state.error = action.payload; // Capture the error message
//       })

//       // Fetch all config templates (reports)
//       .addCase(fetchConfigTemplates.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchConfigTemplates.fulfilled, (state, action) => {
//         state.loading = false;
//         state.configTemplates = action.payload; // Store fetched templates
//       })
//       .addCase(fetchConfigTemplates.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

// // Get config template by ID
// .addCase(getConfigTemplateById.pending, (state) => {
//   state.loading = true; // Set loading to true when the request is initiated
//   state.error = null; // Reset any previous error
// })
// .addCase(getConfigTemplateById.fulfilled, (state, action) => {
//   state.loading = false; // Set loading to false when the request is completed
//   state.configTemplate = action.payload; // Store the fetched config template by ID
// })
// .addCase(getConfigTemplateById.rejected, (state, action) => {
//   state.loading = false; // Set loading to false when the request fails
//   state.error = action.payload; // Capture the error message
// })

//       // // Get config template by patient ID
//       // .addCase(getConfigTemplateByPatientId.pending, (state) => {
//       //   state.loading = true; // Set loading to true when the request is initiated
//       //   state.error = null; // Reset any previous error
//       // })
//       // .addCase(getConfigTemplateByPatientId.fulfilled, (state, action) => {
//       //   state.loading = false; // Set loading to false when the request is completed
//       //   state.configTemplates = action.payload; // Store the fetched config templates for the patient
//       // })
//       // .addCase(getConfigTemplateByPatientId.rejected, (state, action) => {
//       //   state.loading = false; // Set loading to false when the request fails
//       //   state.error = action.payload; // Capture the error message
//       // })

//       // Get the latest config template
//       .addCase(getLatestConfigTemplate.pending, (state) => {
//         state.loading = true; // Set loading to true when the request is initiated
//         state.error = null; // Reset any previous error
//       })
//       .addCase(getLatestConfigTemplate.fulfilled, (state, action) => {
//         state.loading = false; // Set loading to false when the request is completed
//         state.configTemplate = action.payload; // Store the latest config template
//       })
//       .addCase(getLatestConfigTemplate.rejected, (state, action) => {
//         state.loading = false; // Set loading to false when the request fails
//         state.error = action.payload; // Capture the error message
//       })

// // Delete a config template
// .addCase(deleteConfigTemplate.pending, (state) => {
//   state.loading = true;
// })
// .addCase(deleteConfigTemplate.fulfilled, (state, action) => {
//   state.loading = false;
//   state.successMessage = action.payload.message;
//   state.configTemplates = state.configTemplates.filter(
//     (template) => template._id !== action.payload.configTemplateId
//   ); // Remove the deleted template
// })
// .addCase(deleteConfigTemplate.rejected, (state, action) => {
//   state.loading = false;
//   state.error = action.payload;
// });
//   },
// });

// // Exporting the reducer and actions
// export const { resetSuccess } = configTemplateSlice.actions; // Export the resetSuccess action
// export const selectConfigTemplate = (state) =>
//   state.configTemplate.configTemplate;
// export const selectLoading = (state) => state.configTemplate.loading;
// export const selectError = (state) => state.configTemplate.error;

// export default configTemplateSlice.reducer;
