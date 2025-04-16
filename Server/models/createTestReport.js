const mongoose = require("mongoose");

// Define the schema for test results
const createTestReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Assuming there's a separate Patient schema
    },
    testId: {
      type: String,
      required: true,
    },
    userId: { type: String, required: true },
    subtests: [
      {
        subtestName: {
          type: String,
          required: true,
        },
        fields: [
          {
            fieldName: {
              type: String,
              required: true,
            },
            units: {
              type: String,
              required: true,
            },
            referenceRange: {
              type: String, // Can be stored as a string for simplicity. Example: "15.0 - 55.0"
              required: true,
            },
            results: {
              type: String, // Assuming the results are stored as a string
              required: false,
            },
          },
        ],
      },
    ],
    reportNotes: { type: String },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Check if the model is already compiled to avoid overwriting
const CreateTestReport =
  mongoose.models.CreateTestReport ||
  mongoose.model("CreateTestReport", createTestReportSchema);

module.exports = CreateTestReport;
