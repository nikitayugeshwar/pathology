const CreateTestReport = require("../models/CreateTestReport"); // Correct the model import

// Add fields to a test report
exports.addFieldsToTest = async (req, res) => {
  const { testId } = req.params;
  const { fields, userId } = req.body;

  try {
    // Validate fields
    if (!fields || fields.length === 0) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Find the document by testId and patientId
    let testReport = await CreateTestReport.findOne({ testId });

    if (testReport) {
      // If it exists, add the new fields to the existing fields
      testReport.fields.push(...fields);
      await testReport.save();
      return res.status(200).json({
        message: "Fields added successfully to existing test report",
        testReport,
      });
    } else {
      // Create a new document with the testId, patientId, and fields
      testReport = new CreateTestReport({
        testId,
        userId,
        fields,
      });
      await testReport.save();

      // Return a success response
      res.status(201).json({
        message: "Fields added successfully",
        testReport,
      });
    }
  } catch (error) {
    console.error("Error adding fields to test report:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update fields for a test report by testId and patientId
exports.updateFieldsByTestId = async (req, res) => {
  const { testId, patientId } = req.params;
  const { fields } = req.body;

  try {
    // Validate fields
    if (!fields || fields.length === 0) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Find the document by testId and patientId and update the fields
    const updatedTestReport = await CreateTestReport.findOneAndUpdate(
      { testId },
      { fields },
      { new: true } // Return the updated document
    );

    if (!updatedTestReport) {
      return res.status(404).json({ message: "Test report not found" });
    }

    // Return a success response with the updated fields
    res.status(200).json({
      message: "Fields updated successfully",
      updatedTestReport,
    });
  } catch (error) {
    console.error("Error updating test report fields:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get fields for a specific test report by testId and patientId
exports.getFieldsByTestId = async (req, res) => {
  const { testId } = req.params;

  try {
    // Find the document by testId and patientId
    const testReport = await CreateTestReport.findOne({ testId });

    if (!testReport) {
      return res.status(404).json({ message: "Test report fields not found" });
    }

    // Return the test report fields
    res.status(200).json({
      message: "Test report fields retrieved successfully",
      testReport,
    });
  } catch (error) {
    console.error("Error fetching test report fields:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
