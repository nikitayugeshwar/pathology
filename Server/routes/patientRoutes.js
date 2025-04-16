const express = require("express");
const {
  addPatient,
  updatePatient,
  deletePatient,
  getPatient,
  getAllPatients,
  getPatientByTestId,
  getAllPatientsWithTestId,
  getDailyPatientCount,
  getAllPatientsByUserId, // Import the new controller function
} = require("../controllers/patientController");

const router = express.Router();

router.post("/addPatient", addPatient); // Add a new patient
router.get("/getAllPatients/:userId", getAllPatientsByUserId);
router.put("/updatePatient/:id", updatePatient); // Update patient by ID
router.delete("/deletePatient/:id", deletePatient); // Delete patient by ID
router.get("/getPatient/:id", getPatient); // Get a single patient by ID
// router.get("/getAllPatients", getAllPatients); // Get all patients
router.get("/getPatientByTestId/:testId", getPatientByTestId); // Get a patient by testId
router.get("/getAllPatientsWithTestId/:userId", getAllPatientsWithTestId);
router.get("/getTodayPatientCount/:userId", getDailyPatientCount);

module.exports = router;
