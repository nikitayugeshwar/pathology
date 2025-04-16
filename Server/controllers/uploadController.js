const cloudinary = require("../config/cloudinary");

exports.uploadFile = async (req, res) => {
  try {
    console.log("🟢 Received Upload Request");

    if (!req.file) {
      console.error("❌ No file received in request.");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📤 Uploading file to Cloudinary:", req.file.originalname);

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
    });

    console.log("✅ Cloudinary Upload Successful:", result.secure_url);

    return res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: result.secure_url,
    });
  } catch (error) {
    console.error("❌ File upload error:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};
