const Test = require("../models/configTest");

// Add a new test
exports.addTest = async (req, res) => {
  const { testName, userId } = req.body;

  try {
    // Check if a test with the same name exists for the same user
    const existingTest = await Test.findOne({ testName, userId });
    if (existingTest) {
      return res.status(400).json({
        message: "Test with the same name already exists for this user.",
      });
    }

    // Create a new test record with the provided userId
    const newTest = new Test({
      testName,
      userId,
    });

    // Save the new test record to the database
    await newTest.save();

    // Return a success response
    res.status(201).json({
      message: "Test added successfully",
      test: newTest,
    });
  } catch (error) {
    console.error("Error during test creation:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update test by ID
exports.updateTest = async (req, res) => {
  const { id } = req.params;
  const { testName, fields } = req.body;

  console.log("id ", id);
  console.log("Test name", testName);

  try {
    // Find the test by its ID
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Update the test name if provided
    if (testName) {
      test.testName = testName;
    }

    // Update test fields if provided
    if (fields && Array.isArray(fields)) {
      test.fields = fields;
    }

    // Save the updated test record
    await test.save();

    // Return a success response
    res.status(200).json({
      message: "Test updated successfully",
      test,
    });
  } catch (error) {
    console.error("Error updating test:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all tests
exports.getTests = async (req, res) => {
  const { userId } = req.params; // Assuming userId is provided as a route parameter

  try {
    // Fetch all tests for the given userId from the database
    const tests = await Test.find({ userId });

    // Check if tests are found
    if (tests.length === 0) {
      
      return res.status(404).json({ message: "No tests found for this user." });
    }

    // Return a success response with the list of tests
    res.status(200).json({
      message: "Tests retrieved successfully",
      tests,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get test details by ID
exports.getTestById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the test by its ID
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Return a success response with the test details
    res.status(200).json({
      message: "Test retrieved successfully",
      test,
    });
  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Add a new field to a test
exports.addFieldToTest = async (req, res) => {
  const { id } = req.params;
  const { fieldName, fieldValue } = req.body;

  try {
    // Find the test by its ID
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Add the new field to the test's fields array
    test.fields.push({ fieldName, fieldValue });

    // Save the updated test record
    await test.save();

    // Return a success response
    res.status(201).json({
      message: "Field added successfully",
      test,
    });
  } catch (error) {
    console.error("Error adding field to test:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete a test by ID
exports.deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the test by its ID
    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    // Return a success response
    res.status(200).json({
      message: "Test deleted successfully",
      test: deletedTest,
    });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get today's added test count
exports.getTodayTestCount = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a URL parameter
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (00:00)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow (00:00)

    // Aggregate to get today's test count for the specified user
    const todayTestCount = await Test.aggregate([
      {
        $match: {
          createdAt: { $gte: today, $lt: tomorrow }, // Filter by today's date
          userId: userId, // Filter by userId
        },
      },
      {
        $count: "count", // Count the number of matching tests
      },
    ]);

    const count = todayTestCount.length > 0 ? todayTestCount[0].count : 0; // Handle empty results

    res.status(200).json({ count }); // Return as an object
  } catch (error) {
    console.error("Error fetching today's test count:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
