const express = require("express");
const {
  createConfigTemplate,
  updateConfigTemplate,
  deleteConfigTemplate,
  getAllConfigTemplates,
  getConfigTemplateById,
  getLatestConfigTemplate,
} = require("../controllers/configTemplateController");
const multer = require("multer");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Store files temporarily

// Route to create a config template (use upload.fields to handle multiple files)
router.post(
  "/configTemplate",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature1", maxCount: 1 },
    { name: "signature2", maxCount: 1 },
  ]),
  createConfigTemplate
);

router.put(
  "/updateConfigTemplate/:id",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "signature1", maxCount: 1 },
    { name: "signature2", maxCount: 1 },
  ]),
  updateConfigTemplate
);

router.delete("/deleteConfigTemplate/:id", deleteConfigTemplate);
router.get("/configTemplates/:userId", getAllConfigTemplates);
router.get("/getConfigTemplateById/:id", getConfigTemplateById);
router.get("/latestConfigTemplate/:userId", getLatestConfigTemplate);

module.exports = router;
