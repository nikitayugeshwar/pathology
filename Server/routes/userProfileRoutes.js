const express = require("express");
const { saveUser, saveTwilioData, getUserById, updateToggleStatus, getToggleStatus } = require("../controllers/userProfileController");
const { sendPdfLinkController } = require("../controllers/twilioController");


const router = express.Router();

// Route to save user data
router.post("/Email", saveUser);
router.post("/Twilio", saveTwilioData);
router.get("/Data/:userId", getUserById);
router.post("/SendLink", sendPdfLinkController);
router.post("/toggle-status", updateToggleStatus);
router.get("/toggle-status/:userId", getToggleStatus);



module.exports = router;
