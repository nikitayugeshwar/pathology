const CreateTestReport = require("../models/createTestReport");
const Patient = require("../models/patient"); // Import the Patient model
const testsList = require("../testsList");

exports.addPatient = async (req, res) => {
  const {
    firstName,
    lastName,
    contactNumber,
    email,
    gender,
    age,
    sampleCollector,
    dateTime,
    doctorName,
    collectAt,
    tests,
    address,
    userId,
  } = req.body;

  try {
    // Find the last patient number for this user
    const lastPatient = await Patient.findOne({ userId })
      .sort({ patientNumber: -1 })
      .limit(1);

    const patientNumber = lastPatient ? lastPatient.patientNumber + 1 : 1;

    // Create a test array with only the necessary fields
    const testArray = tests.map((test) => ({
      name: test.name,
      id: test.id,
    }));

    // Create a new patient record
    const newPatient = new Patient({
      patientNumber,
      firstName,
      lastName,
      contactNumber,
      email,
      gender,
      age,
      sampleCollector,
      dateTime,
      doctorName,
      collectAt,
      tests: testArray,
      address,
      userId,
      createdAt: new Date(),
    });

    await newPatient.save();

    // Deduplicate tests by ID
    const uniqueTests = Array.from(
      new Map(tests.map((test) => [test.id, test])).values()
    );

    const testReports = await Promise.all(
      uniqueTests.map(async (test) => {
        // Convert test ID to string for consistent matching
        const testId = String(test.id);

        // Find test template
        const templateReport = testsList.find((t) => String(t.id) === testId);

        if (!templateReport) {
          console.error(
            `❌ No template found for test with ID ${testId}. Available templates:`,
            testsList
          );
          throw new Error(`No template found for test with ID ${testId}`);
        }

        // Process the test report
        return {
          patientId: newPatient._id,
          testId,
          userId,
          subtests: templateReport.subtests.map((subtest) => ({
            subtestName: subtest.subtestName,
            fields: subtest.fields.map((field) => ({
              fieldName: field.fieldName,
              units: field.units,
              referenceRange: field.referenceRange,
              results: "", // Default empty result
            })),
          })),
        };
      })
    );

    // Filter out null entries (already existing reports)
    const reportsToInsert = testReports.filter((report) => report !== null);

    // Insert only new reports
    if (reportsToInsert.length > 0) {
      await CreateTestReport.insertMany(reportsToInsert);
    }

    res.status(201).json({
      message: "Patient and test reports added successfully",
      patient: newPatient,
      testReports: reportsToInsert,
    });
  } catch (error) {
    console.error("Error during patient and test report creation:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.updatePatient = async (req, res) => {
  const { id } = req.params; // Patient ID from the URL
  const updates = req.body;

  console.log("Received updates:", updates);

  try {
    // Update patient details
    const updatedPatient = await Patient.findByIdAndUpdate(id, updates, {
      new: true,
    });

    console.log("Updated Patient:", updatedPatient);

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // If test data is included in the update
    if (updates.tests && Array.isArray(updates.tests)) {
      for (const test of updates.tests) {
        const testId = String(test.id); // 🔐 Convert to string explicitly

        const template = testsList.find((t) => String(t.id) === testId);

        console.log("Checking test ID:", testId);
        console.log(
          "Available test IDs:",
          testsList.map((t) => String(t.id))
        );

        if (!template) {
          console.warn(`Test template not found for ID: ${testId}`);
          continue; // Skip to next test if template is not found
        }

        const existingReport = await CreateTestReport.findOne({
          patientId: updatedPatient._id,
          testId: testId,
        });

        console.log("Existing Report:", existingReport);

        const subtests = template.subtests.map((sub) => ({
          subtestName: sub.subtestName,
          fields: sub.fields.map((field) => {
            const existingField =
              existingReport?.subtests
                ?.find((s) => s.subtestName === sub.subtestName)
                ?.fields.find((f) => f.fieldName === field.fieldName) || {};

            return {
              fieldName: field.fieldName,
              units: field.units,
              referenceRange: field.referenceRange,
              results: existingField.results || "",
              status: field.status || existingField.status || null,
            };
          }),
        }));

        if (!existingReport) {
          // Create new test report
          const newReport = new CreateTestReport({
            patientId: updatedPatient._id,
            userId: updatedPatient.userId,
            testId: test.id,
            subtests,
          });
          await newReport.save();
        } else {
          // Update existing test report
          existingReport.subtests = subtests;
          await existingReport.save();
        }
      }
    }

    res.status(200).json({
      message: "Patient and test reports updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params; // Using patient ID from the URL

  try {
    // Find the patient by ID and delete their record
    const deletedPatient = await Patient.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: deletedPatient,
    });
  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getPatient = async (req, res) => {
  const { id } = req.params; // Using patient ID from the URL

  try {
    // Find the patient by ID
    const patient = await Patient.findById(id).lean(); // Use `.lean()` to return a plain JavaScript object

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Add `id` field explicitly
    patient.id = patient._id;

    res.status(200).json({
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error("Error retrieving patient:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getAllPatientsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    // Fetch patients associated with the given userId
    const patients = await Patient.find({ userId }); // Assuming Patient model has a userId field

    res.status(200).json({
      message: "Patients retrieved successfully",
      patients,
    });
  } catch (error) {
    console.error("Error retrieving patients:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getPatientByTestId = async (req, res) => {
  const { testId } = req.params; // Using test ID from the URL

  try {
    // Find the patient by testId
    const patient = await Patient.findOne({ testId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient retrieved successfully",
      patient,
    });
  } catch (error) {
    console.error("Error retrieving patient:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller function to get all patients with a testId
exports.getAllPatientsWithTestId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameters

    // Fetch patients with non-empty tests array containing a valid test ID and matching userId
    const patients = await Patient.find({
      "tests.id": { $ne: null }, // Check that there is at least one test with a non-null id
      userId: userId, // Match the userId
    });

    res.status(200).json({
      message: "Patients with tests retrieved successfully",
      patients,
    });
  } catch (error) {
    console.error("Error retrieving patients:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getDailyPatientCount = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from request parameters

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (00:00)
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow (00:00)

    // Aggregate to get today's patient count for the specific user
    const todayCount = await Patient.aggregate([
      {
        $match: {
          userId: userId, // Match patients created by this user
          createdAt: { $gte: today, $lt: tomorrow }, // Filter by today's date range
        },
      },
      {
        $count: "count", // Count documents matching the filter
      },
    ]);

    const count = todayCount.length > 0 ? todayCount[0].count : 0; // Handle empty results

    res.status(200).json({ count }); // Return the count as an object
  } catch (error) {
    console.error("Error fetching today's patient count:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
