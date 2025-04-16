const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const nodemailer = require("nodemailer");
const Superadmin = require("../models/superadmin"); // Use the Superadmin model

const twilio = require("twilio");


// Registration Controller


exports.register = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if a user with the given email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check if a user with the given mobile number already exists
    const existingUserByMobile = await User.findOne({ mobile });
    if (existingUserByMobile) {
      return res.status(400).json({ message: "Mobile number is already registered" });
    }

    // Generate hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new User({ name, email, mobile, password: hashedPassword });

    // Generate tokens
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "59m" } // Short-lived access token
    );

    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" } // Longer-lived refresh token
    );

    newUser.token = token;
    newUser.refreshToken = refreshToken; // Store refresh token in user record

    // Save the new user
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Login Controller

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const superadmin = await User.findOne({ email });

    if (!superadmin) {
      return res.status(400).json({ message: "Superadmin not found" });
    }

    const isMatch = await bcrypt.compare(password, superadmin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens
    const token = jwt.sign(
      { id: superadmin._id, email: superadmin.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "59m",
      }
    );

    const refreshToken = jwt.sign({ id: superadmin._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Store the tokens in cookies but use names specific to superadmin role
    res.cookie("superadminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("superadminRefreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Superadmin login successful",
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Error during superadmin login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getUser = async (req, res) => {
  const token = req.cookies.superadminToken;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId).select("name email profileImage");

    if (!user) {
      return res.status(404).json({ message: "Superadmin not found" });
    }

    res.status(200).json({
      message: "Superadmin retrieved successfully",
      user,
    });
  } catch (error) {
    
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Refresh Token Controller
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "59m",
    });

    // Optionally, you can generate a new refresh token here as well
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // Store new tokens in cookies
    res.cookie("superadminToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("superadminRefreshToken", newRefreshToken, {
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
  res.cookie("superadminToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  res.cookie("superadminRefreshToken", "", {
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
exports.sendOTP = async (req, res) => {
  const { emailOrMobile } = req.body;

  try {
    let user;
    if (/^\d{10}$/.test(emailOrMobile)) {
      // Check if it's a mobile number
      user = await User.findOne({ mobile: emailOrMobile });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User with this mobile number not found" });
      }

      // Generate and send OTP via SMS
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const newOTP = new OTP({ otp, user: user._id });
      await newOTP.save();
      await twilioClient.messages.create({
        body: `Your OTP code is ${otp}`,
        from: "+19523146554", // Twilio number
        to: `+91${emailOrMobile}`,
      });
    } else {
      // Assume it's an email
      user = await User.findOne({ email: emailOrMobile });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User with this email not found" });
      }

      // Generate and send OTP via email
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
      });
      const newOTP = new OTP({ otp, user: user._id });

      const savedOtp = await newOTP.save();

      // Send OTP via email using nodemailer
      await sendMail({
        to: emailOrMobile,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      });
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { emailOrMobile, otp } = req.body;

  try {
    let user;
    // Find user by email or mobile in Superadmin model
    if (/^\d{10}$/.test(emailOrMobile)) {
      user = await User.findOne({ mobile: emailOrMobile });
    } else {
      user = await User.findOne({ email: emailOrMobile });
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

    // Generate a new JWT token after successful OTP verification
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Store the token in the user's Superadmin record
    user.token = token;
    await user.save();

    // Set the token in cookies
    res.cookie("token", token, {
      httpOnly: true, // Prevents access by JavaScript
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Prevents CSRF
    });

    // Delete the OTP record after successful verification
    await OTP.findByIdAndDelete(otpRecord._id);

    // Respond with the new token and success message
    res.json({ token, message: "OTP verified successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;
  const token = req.cookies.token; // Extract token from cookies

  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  try {
    // Verify the provided token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token to get userId
    const userId = decoded.id; // Extract userId from the decoded token

    // Find user by userId from the token (from Superadmin collection)
    const user = await User.findById(userId);
    if (!user || user.token !== token) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user's password and clear token (invalidate token)
    user.password = hashedPassword;
    user.token = null; // Invalidate the token in the database
    await user.save();

    // Clear the token cookie to log the user out
    res.cookie("token", "", {
      httpOnly: true, // Prevent access by JavaScript
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Mitigates CSRF
      expires: new Date(0), // Expire the cookie immediately
    });

    // Respond with a success message
    res.json({
      message: "Password changed successfully, token removed from cookies",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    console.log("upload image files", req.files); // Debug log
    console.log("upload image body", req.body);

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
    const updatedUser = await User.findByIdAndUpdate(
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
