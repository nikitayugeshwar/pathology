const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  twilioSid: {
    type: String,
  },
  twilioAuthToken: {
    type: String,
  },
  twilioActiveNumber: {
    type: String,
  },
  whatsappActive: {
    type: Boolean,
    default: false,
  },
  twilioActive: {
    type: Boolean,
    default: false,
  },
  emailActive: {
    type: Boolean,
    default: false,
  },
});

const UsersProfile = mongoose.model("UsersProfile", userSchema);
module.exports = UsersProfile;
