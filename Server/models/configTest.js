// models/Test.js
const mongoose = require("mongoose");
const CreateTestReport = require("./createTestReport");
const Patient = require("./Patient"); // Import the Patient model

const TestSchema = new mongoose.Schema({
  testName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
});

// Middleware to delete related test reports and update patients
TestSchema.pre("findOneAndDelete", async function (next) {
  try {
    const doc = await this.model.findOne(this.getQuery()); // Get the document to be deleted
    if (doc) {
      // Delete associated test reports
      await CreateTestReport.deleteMany({ testId: doc._id });

      // Remove the test object with the matching ID from each patient's tests array
      await Patient.updateMany(
        { "tests.id": doc._id },
        { $pull: { tests: { id: doc._id } } } // Pull the test object from the tests array
      );
    }
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware or handler
  }
});

// Optional: Handle findByIdAndDelete
TestSchema.pre("findByIdAndDelete", async function (next) {
  try {
    const doc = await this.model.findById(this.getQuery()._id); // Get the document to be deleted
    if (doc) {
      await CreateTestReport.deleteMany({ testId: doc._id });

      // Remove the test object with the matching ID from each patient's tests array
      await Patient.updateMany(
        { "tests.id": doc._id },
        { $pull: { tests: { id: doc._id } } }
      );
    }
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware or handler
  }
});

// Optional: Handle deleteMany
   TestSchema.pre("deleteMany", async function (next) {
  try {
    const docs = await this.model.find(this.getQuery()); // Get all matching documents
    const testIds = docs.map((doc) => doc._id);

    if (testIds.length > 0) {
      await CreateTestReport.deleteMany({ testId: { $in: testIds } });

      // Remove each test object with a matching ID from each patient's tests array
      await Patient.updateMany(
        { "tests.id": { $in: testIds } },
        { $pull: { tests: { id: { $in: testIds } } } }
      );
    }
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware or handler
  }
});

const Test = mongoose.model("Test", TestSchema);
module.exports = Test;
