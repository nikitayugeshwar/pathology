const express = require("express");
const {
  
  login,
  sendOTP,
  verifyOTP,
  changePassword,
  logout,
  getUser,
  checkLogin,
  refreshToken,
  uploadProfileImage,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post(
  "/uploadProfileImage",
  upload.fields([{ name: "image" }]),
  uploadProfileImage
);

// router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/check-login", checkLogin);
router.post("/send-otp", sendOTP);
router.get("/user", authenticateToken, getUser);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", changePassword);
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is protected route" });
});

router.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the dashboard" });
});

module.exports = router;
