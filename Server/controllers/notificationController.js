const PatientNotificationCount = require("../models/notificationCount");
const OutOfRangeTestResult = require("../models/OutOfRangeTestResult");

// Controller function to reset notification count
exports.resetNotificationCount = async (req, res) => {
  const { userId } = req.body;

  console.log("user id", userId);

  try {
    // Find the user by userId and update the notification count to 0
    const user = await PatientNotificationCount.findOneAndUpdate(
      { userId: userId }, // Filter by userId field, not _id
      { notificationCount: 0 },
      { new: true }
    );

    console.log("user", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Notification count reset successfully",
    });
  } catch (error) {
    console.error("Error resetting notification count:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to get the notification count for a specific user
exports.getNotificationCount = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query params

    // Find the notification count for the specific user
    const notification = await PatientNotificationCount.findOne({
      userId: userId,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification count not found for this user",
      });
    }

    // Return the notification count
    res.status(200).json({
      count: notification.notificationCount,
    });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({
      message: "Error fetching notification count",
    });
  }
};

// Controller to get out-of-range test results by userId
exports.getOutOfRangeResultsByUserId = async (req, res) => {
  const { userId } = req.query;

  try {
    // Fetch out-of-range results for the given userId, sorted by latest first
    const outOfRangeResults = await OutOfRangeTestResult.find({ userId })
      .select("patientId patientName testName testResult createdAt")
      .sort({ createdAt: -1 }) // Sort by `createdAt` in descending order
      .lean();

    if (!outOfRangeResults.length) {
      return res
        .status(404)
        .json({ message: "No out-of-range results found." });
    }

    // Group results by patientId and patientName
    const patientMap = new Map();

    outOfRangeResults.forEach((result) => {
      const patientKey = `${result.patientId}-${result.patientName}`;

      if (!patientMap.has(patientKey)) {
        // If the patient is not already in the map, add them with an array for tests
        patientMap.set(patientKey, {
          patientId: result.patientId,
          patientName: result.patientName,
          tests: [{ testName: result.testName, testResult: result.testResult }],
        });
      } else {
        // If the patient is already in the map, push the new test data to their tests array
        patientMap.get(patientKey).tests.push({
          testName: result.testName,
          testResult: result.testResult,
        });
      }
    });

    // Convert the map to an array of results
    const uniqueResults = Array.from(patientMap.values());

    console.log("Grouped out-of-range results:", uniqueResults);

    res.status(200).json(uniqueResults);
  } catch (error) {
    console.error("Error fetching out-of-range results:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching out-of-range results." });
  }
};

