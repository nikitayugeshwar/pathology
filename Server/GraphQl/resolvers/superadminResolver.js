const axios = require("axios");
const BASE_URL = process.env.BASE_URL || "http://localhost:5000/api/superadmin"; // Adjust the backend API URL

const superAdminResolver = {
  Query: {
    getSuperadminById: async (_, { id }) => {
      try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch superadmin"
        );
      }
    },
    getAllSuperadmins: async (_, { superAdminId }) => {
      try {
        const response = await axios.get(
          `${BASE_URL}/superAdminId/${superAdminId}`
        );
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to fetch superadmins"
        );
      }
    },
  },

  Mutation: {
    createSuperadmin: async (_, { input }) => {
      try {
        const response = await axios.post(`${BASE_URL}/create`, input);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to create superadmin"
        );
      }
    },

    updateSuperadmin: async (_, { id, input }) => {
      try {
        const response = await axios.put(`${BASE_URL}/${id}`, input);
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to update superadmin"
        );
      }
    },

    deleteSuperadmin: async (_, { id }) => {
      try {
        await axios.delete(`${BASE_URL}/${id}`);
        return "Superadmin deleted successfully";
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to delete superadmin"
        );
      }
    },

    updateActiveStatus: async (_, { id, active }) => {
      try {
        const response = await axios.patch(`${BASE_URL}/update-active/${id}`, {
          active,
        });
        return response.data.updatedSuperadmin;
      } catch (error) {
        throw new Error(
          error.response?.data?.error || "Failed to update active status"
        );
      }
    },
  },
};

module.exports = superAdminResolver;
