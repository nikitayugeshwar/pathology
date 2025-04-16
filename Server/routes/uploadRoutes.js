const express = require("express");
const multer = require("multer");
const { uploadFile } = require("../controllers/uploadController");

const router = express.Router();

// ✅ Use Multer to handle file uploads separately from GraphQL
const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.single("file"), uploadFile);

module.exports = router;
