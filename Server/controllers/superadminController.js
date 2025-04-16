// controllers/superadminController.js

const Superadmin = require("../models/superadmin");

// Create a new Superadmin
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "db53923ddce989dd5308ebf237810860d93fca48cc3f67a2a4dca553de193ac1";
const JWT_REFRESH_SECRET = "rG1y$h8e5@jT4!d&k3B*2qM9eW!8wP^sZ1eX6z#D7jN!3fXq";

exports.createSuperadmin = async (req, res) => {
  try {
    const { userId, email, userName, superAdminId, password, ...otherFields } =
      req.body;

    // Check for unique userId and userName within the same superAdminId
    const existingSuperAdminData = await Superadmin.findOne({
      superAdminId,
      $or: [{ userId }, { userName }],
    });

    if (existingSuperAdminData) {
      if (existingSuperAdminData.userId === userId) {
        return res
          .status(400)
          .json({ error: "User ID already exists for this Super Admin" });
      }
      if (existingSuperAdminData.userName === userName) {
        return res
          .status(400)
          .json({ error: "Username already exists for this Super Admin" });
      }
    }

    // Check for globally unique email
    const existingEmail = await Superadmin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create new superadmin document
    const newSuperadmin = new Superadmin(req.body);

    // Generate JWT access token
    const token = jwt.sign(
      {
        userId: newSuperadmin.userId,
        email: newSuperadmin.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" } // Access token will expire in 1 hour
    );

    // Generate JWT refresh token
    const refreshToken = jwt.sign(
      {
        userId: newSuperadmin.userId,
        email: newSuperadmin.email,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Refresh token will expire in 7 days
    );

    // Add tokens to the Superadmin document
    newSuperadmin.token = token;
    newSuperadmin.refreshToken = refreshToken;

    // Save new superadmin with the tokens
    await newSuperadmin.save();

    // Return success response with both tokens
    res.status(201).json({
      message: "Superadmin created successfully",
      token,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all Superadmins
exports.getAllSuperadmins = async (req, res) => {
  console.log("req.params", req.params);
  const { superAdminId } = req.params; // Assuming superAdminId is passed as a route parameter
  console.log("superAdminId", superAdminId);
  try {
    const superadmins = await Superadmin.find({ superAdminId });

    res.status(200).json(superadmins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllSuperadminsBySuperAdminId = async (req, res) => {
  console.log("req.params", req.params);
  const { superAdminId } = req.params; // Assuming superAdminId is passed as a route parameter
  console.log("superAdminId", superAdminId);

  try {
    // Find superadmins with the specified superAdminId
    const superadmins = await Superadmin.find({ superAdminId });

    if (superadmins.length === 0) {
      return res
        .status(404)
        .json({ message: "No super admins found for this ID" });
    }

    res.status(200).json(superadmins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a Superadmin by ID
exports.getSuperadminById = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const superadmin = await Superadmin.findById(id);

    if (!superadmin) {
      return res.status(404).json({ error: "Superadmin not found" });
    }

    res.status(200).json(superadmin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Superadmin by ID
exports.updateSuperadmin = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const updatedData = req.body;

    // Optionally check for existing unique fields if required
    const existingSuperadmin = await Superadmin.findOne({
      $or: [
        { userId: updatedData.userId },
        { email: updatedData.email },
        { userName: updatedData.userName },
      ],
      _id: { $ne: id }, // Exclude the current superadmin from the check
    });

    if (existingSuperadmin) {
      return res
        .status(400)
        .json({ error: "User ID, Email, or Username already exists" });
    }

    const updatedSuperadmin = await Superadmin.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedSuperadmin) {
      return res.status(404).json({ error: "Superadmin not found" });
    }

    res
      .status(200)
      .json({ message: "Superadmin updated successfully", updatedSuperadmin });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Superadmin by ID
exports.deleteSuperadmin = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const deletedSuperadmin = await Superadmin.findByIdAndDelete(id);

    if (!deletedSuperadmin) {
      return res.status(404).json({ error: "Superadmin not found" });
    }

    res.status(200).json({ message: "Superadmin deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateActiveStatus = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from request parameters
    const { active } = req.body; // Get the active status from the request body

    // Validate the active status
    if (typeof active !== "boolean") {
      return res.status(400).json({ error: "Active status must be a boolean" });
    }

    const updatedSuperadmin = await Superadmin.findByIdAndUpdate(
      id,
      { active }, // Update only the active field
      { new: true } // Return the updated document
    );

    if (!updatedSuperadmin) {
      return res.status(404).json({ error: "Superadmin not found" });
    }

    res.status(200).json({
      message: "Active status updated successfully",
      updatedSuperadmin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
