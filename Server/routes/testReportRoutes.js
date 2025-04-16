const express = require("express");
const {
  createTestReport,
  getAllTestReports,
  getTestReportById,
  updateTestReport,
  getTestReportsByTestId,
  getEmptyResultsCount,
  getTestReportsByPatientId,
  sendEmailWithReport,
} = require("../controllers/createTestReportController");

const router = express.Router();

// Routes
router.post("/addTestReport", createTestReport);
router.post("/sendEmail", sendEmailWithReport);
router.get("/getAllReports", getAllTestReports);
router.get("/getReportById/:id", getTestReportById);
router.put("/updateReport/:id", updateTestReport);
router.get("/getReportByTestId/:testId", getTestReportsByTestId);
router.get("/getReportByPatientId/:patientId", getTestReportsByPatientId);
router.get("/getEmptyResultsCount/:userId", getEmptyResultsCount);

module.exports = router;
