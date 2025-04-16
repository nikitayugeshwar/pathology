const express = require("express");
const {
  createSuperadmin,
  getAllSuperadmins,
  getSuperadminById,
  updateSuperadmin,
  deleteSuperadmin,
  updateActiveStatus,
  getAllSuperadminsBySuperAdminId, // Import the new controller function
} = require("../controllers/superadminController");

const router = express.Router();

// Route to create a new superadmin
router.post("/create", createSuperadmin);

// Route to get all superadmins
router.get("/superAdminId/:superAdminId", getAllSuperadmins);

// Route to get a superadmin by ID
router.get("/:id", getSuperadminById);

// Route to update a superadmin by ID
router.put("/:id", updateSuperadmin);

// Route to delete a superadmin by ID
router.delete("/:id", deleteSuperadmin);

// Route to update active status by ID
router.patch("/update-active/:id", updateActiveStatus); 
// In your routes file
router.get('/:superAdminId', getAllSuperadminsBySuperAdminId);

// Add this line

module.exports = router;
