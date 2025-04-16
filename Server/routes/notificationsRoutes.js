//notificationRoutes.js
const express = require("express");
const router = express.Router();
const {
  resetNotificationCount,
  getNotificationCount,
  getOutOfRangeResultsByUserId,
} = require("../controllers/notificationController");
const { getIo } = require("../socket"); // Import the Socket.io instance

// Define the route for resetting the notification count
router.post("/resetNotificationCount", resetNotificationCount);
router.get("/notificationCount", getNotificationCount);
router.get("/outOfRangeResults", getOutOfRangeResultsByUserId);

// Route to send a notification
router.post("/notify", (req, res) => {
  const { title, description, date } = req.body;

  // Validate input
  if (!title || !description || !date) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const newResult = { title, description, date };

  // Emit the notification event to all connect
  const io = getIo();

  io.emit("newNotification", { title, description, date });

  // Send success response
  res.status(200).json({ success: true, message: "Notification sent!" });
});

module.exports = router;
