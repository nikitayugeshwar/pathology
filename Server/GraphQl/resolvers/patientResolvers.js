const axios = require("axios");

const resolvers = {
  Query: {
    getAllPatients: async (_, { userId }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getAllPatients/${userId}`
        );

        return response.data.patients.map((patient) => ({
          ...patient,
          id: patient._id || patient.id,
        }));
      } catch (error) {
        console.error("Error fetching patients:", error);
        throw new Error("Failed to fetch patients");
      }
    },

    getPatientById: async (_, { id }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getPatient/${id}`
        );
        return response.data.patient;
      } catch (error) {
        console.error("Error fetching patient:", error);
        throw new Error("Failed to fetch patient");
      }
    },

    getPatientByTestId: async (_, { testId }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getPatientByTestId/${testId}`
        );
        return response.data.patient;
      } catch (error) {
        console.error("Error fetching patient by test ID:", error);
        throw new Error("Failed to fetch patient by test ID");
      }
    },

    getAllPatientsWithTestId: async (_, { userId }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getAllPatientsWithTestId/${userId}`
        );

        return response.data.patients.map((patient) => ({
          ...patient,
          id: patient._id || patient.id,
        }));
      } catch (error) {
        console.error("Error fetching patients with test ID:", error);
        throw new Error("Failed to fetch patients with test ID");
      }
    },

    getDailyPatientCount: async (_, { userId }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getTodayPatientCount/${userId}`
        );
        return response.data.count;
      } catch (error) {
        console.error("Error fetching today's patient count:", error);
        throw new Error("Failed to fetch today's patient count");
      }
    },
  },

  Mutation: {
    addPatient: async (_, { input }) => {
      try {
        console.log("Received Input:", JSON.stringify(input, null, 2));

        const response = await axios.post(
          "http://localhost:3000/addPatient",
          input
        );
        const newPatient = response.data.patient;

        if (!newPatient) {
          throw new Error("Invalid response: Missing patient object");
        }

        const patient = response.data.patient;

        return {
          ...patient,
          id: patient.id || patient._id.toString(), // ✅ Ensure id exists
        };
      } catch (error) {
        console.error("Error adding patient:", error);
        throw new Error("Failed to add patient");
      }
    },

    updatePatient: async (_, { id, input }) => {
      try {
        console.log("Updating patient with ID:", id);
        console.log("Received Input:", JSON.stringify(input, null, 2));
        // Ensure the input is not empty
        const response = await axios.put(
          `http://localhost:3000/updatePatient/${id}`,
          input
        );

        return {
          success: true,
          message: "Patient updated successfully",
          patient: response.data.patient,
        };
      } catch (error) {
        console.error("Error updating patient:", error);
        throw new Error(
          error.response?.data?.message || "Failed to update patient"
        );
      }
    },

    deletePatient: async (_, { id }) => {
      try {
        console.log("Deleting patient with ID:", id);
        const response = await axios.delete(
          `http://localhost:3000/deletePatient/${id}`
        );
        return response.data.message;
      } catch (error) {
        console.error("Error deleting patient:", error);
        throw new Error("Failed to delete patient");
      }
    },
  },
};

module.exports = resolvers;
