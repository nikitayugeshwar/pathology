const axios = require("axios");

const resolvers = {
  Query: {
    getTestReportsByPatientId: async (_, { patientId }) => {
      try {
        console.log("patientId:", patientId);

        const response = await axios.get(
          `http://localhost:3000/getReportByPatientId/${patientId}`
        );

        // Debugging log
        console.log("API Response:", response.data);

        return response.data.map((report) => ({
          id: report?._id || "Unknown ID",
          testName: report?.testName || "Unknown Test",
          fields:
            report?.fields?.map((field) => ({
              fieldName: field?.fieldName || "N/A",
              results: field?.results || "N/A",
              units: field?.units || "N/A",
              referenceRange: field?.referenceRange || "N/A",
            })) || [],
        }));
      } catch (error) {
        console.error("Error fetching reports:", error);
        throw new Error("Failed to fetch reports");
      }
    },
  },
};

module.exports = resolvers;
