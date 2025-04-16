const mongoose = require("mongoose");

const PatientNotificationCountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  notificationCount: {
    type: Number,
    default: 0,
  },
});

// Use existing model if already compiled to avoid OverwriteModelError
const PatientNotificationCount =
  mongoose.models.PatientNotificationCountSchema ||
  mongoose.model("PatientNotificationCount", PatientNotificationCountSchema);

module.exports = PatientNotificationCount;
