const mongoose = require("mongoose");

// Schema for the fields
const FieldSchema = new mongoose.Schema({
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
});

// Main schema for the Test with multiple fields
const TestFieldSchema = new mongoose.Schema({
  testId: {
    type: String,
    required: true,
  },
  fields: [FieldSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const TestFeilds = mongoose.model("TestFields", TestFieldSchema);
module.exports = TestFeilds;
