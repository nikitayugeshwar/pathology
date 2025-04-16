const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
});

const patientSchema = new mongoose.Schema({
  patientNumber: { type: Number, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  sampleCollector: { type: String, required: true },
  dateTime: { type: Date, required: true },
  doctorName: { type: String, required: true },
  collectAt: { type: String, required: true },
  tests: [testSchema], // Array of test objects with name and id
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, index: true },
  userId: { type: String, required: true, index: true },
});

// Apply indexes for optimized queries
patientSchema.index({ createdAt: 1, userId: 1 });

// Middleware to handle cascading delete
patientSchema.pre("remove", async function (next) {
  try {
    // Remove all associated CreateTestReport documents
    await mongoose
      .model("CreateTestReport")
      .deleteMany({ patientId: this._id });
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);

module.exports = Patient;
