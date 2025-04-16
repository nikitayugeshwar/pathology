const axios = require("axios");
const ConfigTemplate = require("../../models/ConfigTemplate");
const BASE_URL = "http://localhost:3000"; // Your Express API base URL

const resolvers = {
  Query: {
    // Fetch all config templates using the Express API
    getConfigTemplates: async (_, { userId }, context) => {
      console.log("✅ Resolver received userId:", userId);
      console.log("🔍 Context userId:", context.userId);

      const finalUserId = userId || context.userId;
      if (!finalUserId) {
        console.error("🚨 No userId found in args or context!");
        throw new Error("Unauthorized: No userId found");
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/configTemplates/${finalUserId}`
        );
        return response.data;
      } catch (error) {
        console.error("❌ Error fetching config templates:", error);
        throw new Error("Failed to fetch config templates");
      }
    },

    // Fetch a specific config template by ID
    getConfigTemplateById: async (_, { id }) => {
      try {
        console.log("🟢 Received ID in Resolver:", id); // Debugging

        if (!id) {
          console.error("❌ ID is missing in GraphQL request");
          throw new Error("ID is required");
        }

        const response = await axios.get(
          `${BASE_URL}/getConfigTemplateById/${id}`
        );

        console.log("✅ API Response:", response.data); // Debugging
        return response.data;
      } catch (error) {
        console.error("❌ Error fetching config template by ID:", error);
        throw new Error("Failed to fetch config template");
      }
    },

    // Fetch the latest config template
    getLatestConfigTemplate: async (_, { userId }) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/latestConfigTemplate/${userId}`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching latest config template:", error);
        throw new Error("Failed to fetch latest config template");
      }
    },
  },

  Mutation: {
    // Add a new config template using Express API
    addConfigTemplate: async (_, { input }) => {
      try {
        console.log("🔹 Received input from frontend:", input);

        // Ensure all required fields are present
        if (!input.clinicName || !input.doctorName || !input.mobile) {
          throw new Error("Missing required fields");
        }

        // Create new config template with file URLs
        const newConfigTemplate = new ConfigTemplate({
          clinicName: input.clinicName,
          doctorName: input.doctorName,
          mobile: input.mobile,
          headerName: input.headerName,
          subHeaderName: input.subHeaderName,
          footer: input.footer,
          userId: input.userId,
          logo: input.logo || null, // ✅ Accept URL
          signature1: input.signature1 || null,
          signature2: input.signature2 || null,
        });

        // Save to MongoDB
        await newConfigTemplate.save();
        console.log("✅ Saved to database:", newConfigTemplate);

        return newConfigTemplate;
      } catch (error) {
        console.error("❌ Error processing config template:", error);
        throw new Error("Failed to add config template");
      }
    },
    // addConfigTemplate: async (_, { input }) => {
    //   try {
    //     console.log("Received Input:", input);

    //     const formData = new FormData();
    //     for (const key in input) {
    //       formData.append(key, input[key]);
    //     }

    //     const response = await axios.post(
    //       `${BASE_URL}/configTemplate`,
    //       formData,
    //       {
    //         headers: { "Content-Type": "multipart/form-data" },
    //       }
    //     );

    //     return response.data.configTemplate;
    //   } catch (error) {
    //     console.error("Error adding config template:", error);
    //     throw new Error("Failed to add config template");
    //   }
    // },

    // Update an existing config template
    updateConfigTemplate: async (_, { id, input }) => {
      try {
        const formData = new FormData();
        for (const key in input) {
          formData.append(key, input[key]);
        }

        const response = await axios.put(
          `${BASE_URL}/updateConfigTemplate/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        return response.data.configTemplate;
      } catch (error) {
        console.error("Error updating config template:", error);
        throw new Error("Failed to update config template");
      }
    },

    // Delete a config template
    deleteConfigTemplate: async (_, { id }) => {
      try {
        console.log("Deleting config template with ID:", id);
        const response = await axios.delete(
          `${BASE_URL}/deleteConfigTemplate/${id}`
        );
        return response.data.message;
      } catch (error) {
        console.error("Error deleting config template:", error);
        throw new Error("Failed to delete config template");
      }
    },
  },
};

module.exports = resolvers;
