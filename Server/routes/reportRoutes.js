const express = require("express");
const router = express.Router();
const upload = require("../config/multer"); // Multer configuration for file uploads
const reportController = require("../controllers/reportController");

// Route to upload PDF report
router.post("/upload", upload.single("pdf"), reportController.uploadReport);

// Route to get PDF report by patientId
router.get("/:patientId", reportController.getReportByPatientId);

module.exports = router;
