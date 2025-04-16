const mongoose = require("mongoose");

// Schema to store test results that are out of range
const outOfRangeTestResultSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    testId: {
      type: String,
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    testResult: [
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
          type: String,
          required: true,
        },
        results: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const OutOfRangeTestResult =
  mongoose.models.OutOfRangeTestResult ||
  mongoose.model("OutOfRangeTestResult", outOfRangeTestResultSchema);

module.exports = OutOfRangeTestResult;
