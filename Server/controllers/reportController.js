const Report = require("../models/reportModel");

const fs = require("fs");

// Function to handle PDF upload
exports.uploadReport = async (req, res) => {
  try {
    const { patientId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const filePath = req.file.path;

    // Check if a report already exists for the given patientId
    const existingReport = await Report.findOne({ patientId });

    if (existingReport) {
      // Remove the existing PDF file from the multer storage
      fs.unlink(existingReport.filePath, (err) => {
        if (err) {
          console.error("Error deleting old PDF file:", err);
        } else {
          console.log("Old PDF file deleted successfully");
        }
      });

      // Update the report in the database with the new file path
      existingReport.filePath = filePath;
      await existingReport.save();

      return res.status(200).json({
        message: "Report updated successfully",
        report: existingReport,
      });
    }

    // Create a new report if no existing report for the patientId
    const newReport = new Report({ patientId, filePath });
    await newReport.save();

    res
      .status(201)
      .json({ message: "Report uploaded successfully", report: newReport });
  } catch (error) {
    console.error("Error uploading report:", error);
    res.status(500).json({ error: "Failed to upload report" });
  }
};

// Function to get PDF by patientId
exports.getReportByPatientId = async (req, res) => {
  try {
    const { patientId } = req.params;

    const report = await Report.findOne({ patientId });

    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "No report found" });
    }

    // If report is found, send the file
    res.sendFile(report.filePath, { root: "." }); // Sends the PDF file to the client
  } catch (error) {
    console.error("Error retrieving report:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve report" });
  }
};
