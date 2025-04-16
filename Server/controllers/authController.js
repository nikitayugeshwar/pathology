const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const nodemailer = require("nodemailer");
const Superadmin = require("../models/superadmin"); // Use the Superadmin model

const twilio = require("twilio");

// Login Controller

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Superadmin.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if the user is active
    if (!user.active) {
      return res.status(403).json({ message: "User is not active" });
    }

    // Compare the provided password with the one stored in the database (plain text comparison)
    if (password !== user.password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "59m",
      }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store the tokens in cookies but use names specific to user role
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("userRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      id: user._id,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getUser = async (req, res) => {
  const token = req.cookies.userToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await Superadmin.findById(userId).select(
      "firstName lastName email profileImage"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError" && error.message === "jwt expired") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.error("Error retrieving user:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Refresh Token Controller
exports.refreshToken = async (req, res) => {
  const { userRefreshToken } = req.cookies;

  if (!userRefreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(
      userRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    const user = await Superadmin.findById(decoded.id);

    if (!user || user.refreshToken !== userRefreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "59m",
      }
    );

    // Optionally, you can generate a new refresh token here as well
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Store new tokens in cookies
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Tokens refreshed successfully",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  res.cookie("userToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie("userRefreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logout successful" });
};

exports.checkLogin = async (req, res) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res
        .status(200)
        .json({ message: "User already logged in", userId: decoded.id });
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }
  res.status(401).json({ message: "User not logged in" });
};

// Add this to your authController.js

// Twilio Configuration (example)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send email using nodemailer
const sendMail = async ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

// Exported function to send OTP
// Send OTP Controller
exports.sendOTP = async (req, res) => {
  const { emailOrMobile } = req.body;

  if (!emailOrMobile) {
    return res.status(400).json({ message: "Email or mobile is required" });
  }

  try {
    let user;
    const isMobile = /^\d{10}$/.test(emailOrMobile);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);

    // Determine if input is valid
    if (!isMobile && !isEmail) {
      return res
        .status(400)
        .json({ message: "Invalid email or mobile number" });
    }

    // Find user by contact
    user = isMobile
      ? await Superadmin.findOne({ contactNumber: emailOrMobile })
      : await Superadmin.findOne({ email: emailOrMobile });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Save OTP in DB
    await OTP.create({ otp, user: user._id });

    // Send OTP via SMS or Email
    if (isMobile) {
      await twilioClient.messages.create({
        body: `Your OTP code is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER, // Should be set in env
        to: `+91${emailOrMobile}`,
      });
    } else {
      await sendMail({
        to: emailOrMobile,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in sendOTP:", error.message);
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  const { emailOrMobile, otp } = req.body;

  try {
    let user;
    if (/^\d{10}$/.test(emailOrMobile)) {
      user = await Superadmin.findOne({ mobile: emailOrMobile });
    } else {
      user = await Superadmin.findOne({ email: emailOrMobile });
    }

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid email or mobile number" });
    }

    const otpRecord = await OTP.findOne({ otp, user: user._id });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate a new JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Store the new token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Optionally, you can store this new token in the user database
    user.token = token;
    await user.save();

    // Delete the OTP record after verification
    await OTP.findByIdAndDelete(otpRecord._id);

    // Return the new token and success message
    res.json({ token, message: "OTP verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure JWT_SECRET is correctly set

    const userId = decoded.id;

    const user = await Superadmin.findById(userId);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Proceed with password update
    user.password = newPassword;
    await user.save();

    // Clear token cookie
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error during password change:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    console.log("upload image files in auth controller ", req.files); // Debug log
    console.log("upload image body auth controller ", req.body);

    if (!req.files || !req.files.image || req.files.image.length === 0) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const filePath = req.files.image[0].path; // Access file path

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "profile_images", // Optional: specify folder in Cloudinary
    });
    const profileImageUrl = result.secure_url;

    // Update user's profile image in the database
    const userId = req.body.userId;
    const updatedUser = await Superadmin.findByIdAndUpdate(
      userId,
      { profileImage: profileImageUrl },
      { new: true }
    );

    console.log("uploaded profile ", updatedUser);

    // Clean up: remove the locally uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: updatedUser.profileImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res
      .status(500)
      .json({ error: "An error occurred while uploading the image" });
  }
};
