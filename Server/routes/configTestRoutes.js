const express = require("express");
const {
  addTest,
  getTests,
  getTestById,
  deleteTest,
  updateTest,
  getTodayTestCount,
} = require("../controllers/configTestController");
const {
  addFieldsToTest,
  updateFieldsByTestId,
  getFieldsByTestId,
} = require("../controllers/configTestAddFeildController");

const router = express.Router();

router.post("/addTest", addTest);
router.put("/updateTest/:id", updateTest);
router.delete("/deleteTest/:id", deleteTest);
router.get("/getTestById/:id", getTestById);
router.get("/getTest/:userId", getTests);

// addFeilds routes
router.post("/addTestFeild/:testId", addFieldsToTest);
router.put("/updateTestFeild/:testId", updateFieldsByTestId);
router.get("/getTestFeildById/:testId", getFieldsByTestId);
router.get("/getTodayTestCount/:userId", getTodayTestCount);

module.exports = router;
