const mongoose = require("mongoose");

const superadminSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    superAdminId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clinicName: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    dateTime: { type: Date, required: true },
    address: { type: String, required: true },
    active: { type: Boolean, default: true },
    token: { type: String },
    refreshToken: { type: String },
    profileImage: { type: String },
    paymentStatus: {
      type: String, // e.g., 'active', 'pending', or 'inactive'
      default: "inactive",
    },
    subscriptionExpiresAt: {
      type: Date, // To track subscription expiration
    },
  },
  { timestamps: true }
);

// Create compound unique index on superAdminId and userId
superadminSchema.index({ superAdminId: 1, userId: 1 }, { unique: true });
superadminSchema.index({ superAdminId: 1, userName: 1 }, { unique: true }); // Make userName unique within superAdminId

const Superadmin =
  mongoose.models.Superadmin || mongoose.model("Superadmin", superadminSchema);

module.exports = Superadmin;
