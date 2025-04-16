const UsersProfile = require("../models/userProfile");
const twilio = require("twilio");

const saveUser = async (req, res) => {
  const { userId, email, password } = req.body;

  if (!userId || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user profile already exists
    const existingUser = await UsersProfile.findOne({ userId });

    if (existingUser) {
      // Update existing user
      existingUser.email = email;
      existingUser.password = password;
      await existingUser.save();
      return res
        .status(200)
        .json({ message: "User profile updated successfully" });
    } else {
      // Create new user profile
      const newUser = new UsersProfile({ userId, email, password });
      await newUser.save();
      return res
        .status(201)
        .json({ message: "User profile saved successfully" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const saveTwilioData = async (req, res) => {
  const { userId, twilioSid, twilioAuthToken, twilioActiveNumber } = req.body;

  if (!userId || !twilioSid || !twilioAuthToken || !twilioActiveNumber) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const client = twilio(twilioSid, twilioAuthToken);

    // Verify the active number belongs to the Twilio account
    const incomingPhoneNumbers = await client.incomingPhoneNumbers.list();
    const isValidNumber = incomingPhoneNumbers.some(
      (num) => num.phoneNumber === twilioActiveNumber
    );

    if (!isValidNumber) {
      return res
        .status(400)
        .json({
          message:
            "Twilio active number is not valid or not associated with the provided account.",
        });
    }

    // Check if Twilio data already exists for the user
    const existingTwilioData = await UsersProfile.findOne({ userId });

    if (existingTwilioData) {
      // Update existing Twilio data
      existingTwilioData.twilioSid = twilioSid;
      existingTwilioData.twilioAuthToken = twilioAuthToken;
      existingTwilioData.twilioActiveNumber = twilioActiveNumber;
      await existingTwilioData.save();
      return res
        .status(200)
        .json({ message: "Twilio data updated successfully" });
    } else {
      // Save new Twilio data
      const twilioData = new UsersProfile({
        userId,
        twilioSid,
        twilioAuthToken,
        twilioActiveNumber,
      });

      await twilioData.save();
      return res
        .status(201)
        .json({ message: "Twilio data saved and verified successfully" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Twilio verification failed", error: err.message });
  }
};

// Controller function to get user data by userId
const getUserById = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;

    // Fetch user data by userId
    const user = await UsersProfile.findOne({ userId });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data as response
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);

    // Handle error
    return res.status(500).json({ message: "Server error" });
  }
};

// Controller function to handle toggle status update
const updateToggleStatus = async (req, res) => {
  const { userId, toggleKey, status } = req.body;

  if (!userId || !toggleKey || typeof status !== "boolean") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const updateFields = {
      [`${toggleKey}Active`]: status, // Dynamically set field (e.g., whatsappActive, twilioActive)
    };

    const result = await UsersProfile.updateOne(
      { userId },
      { $set: updateFields }
    );

    if (result.nModified === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating toggle status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to fetch toggle statuses
const getToggleStatus = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await UsersProfile.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const toggleStatus = {
      whatsapp: user.whatsappActive || false,
      twilio: user.twilioActive || false,
      email: user.emailActive || false,
    };

    res.status(200).json(toggleStatus);
  } catch (error) {
    console.error("Error fetching toggle statuses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  saveUser,
  saveTwilioData,
  getUserById,
  updateToggleStatus,
  getToggleStatus,
};
