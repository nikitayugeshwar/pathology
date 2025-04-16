const cloudinary = require("../config/cloudinary");
const ConfigTemplate = require("../models/ConfigTemplate");

// Create a new config template
exports.createConfigTemplate = async (req, res) => {
  const {
    clinicName,
    doctorName,
    headerName,
    subHeaderName,
    footer,
    userId,
    mobile,
  } = req.body;

  // const patientId = "6703cbc1ba1a41628d846226";
  try {
    // Validate required fields
    if (!clinicName) {
      return res
        .status(400)
        .json({ message: "Clinic Name, Test ID, and Test Name are required" });
    }

    // Helper function to upload image to Cloudinary
    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url; // Return the Cloudinary image URL
    };

    // Create the new config template object
    const newConfigTemplate = new ConfigTemplate({
      clinicName,
      doctorName,
      mobile,
      headerName,
      subHeaderName,
      footer,
      userId,
      // Include patientId when creating the template
      logo: req.files["logo"] ? await uploadImage(req.files["logo"][0]) : null,
      signature1: req.files["signature1"]
        ? await uploadImage(req.files["signature1"][0])
        : null,
      signature2: req.files["signature2"]
        ? await uploadImage(req.files["signature2"][0])
        : null,
    });

    // Save the config template to the database
    await newConfigTemplate.save();
    return res.status(201).json({
      message: "Config template created successfully",
      configTemplate: newConfigTemplate,
    });
  } catch (error) {
    console.error("Error creating config template:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Update an existing config template by ID
exports.updateConfigTemplate = async (req, res) => {
  const { id } = req.params;
  const { clinicName, doctorName, mobile, headerName, subHeaderName, footer } =
    req.body;

  try {
    // Validate required fields
    if (!clinicName) {
      return res.status(400).json({ message: "Clinic Name is required" });
    }

    // Find the existing config template
    const existingTemplate = await ConfigTemplate.findById(id);
    if (!existingTemplate) {
      return res.status(404).json({ message: "Config template not found" });
    }

    // Handle image uploads to Cloudinary
    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    };

    // Update fields
    existingTemplate.clinicName = clinicName || existingTemplate.clinicName;
    existingTemplate.doctorName = doctorName || existingTemplate.doctorName;
    existingTemplate.mobile = mobile || existingTemplate.mobile;
    existingTemplate.headerName = headerName || existingTemplate.headerName;
    existingTemplate.subHeaderName =
      subHeaderName || existingTemplate.subHeaderName;
    existingTemplate.footer = footer || existingTemplate.footer;

    // Update images if they are uploaded
    if (req.files["logo"])
      existingTemplate.logo = await uploadImage(req.files["logo"][0]);
    if (req.files["signature1"])
      existingTemplate.signature1 = await uploadImage(
        req.files["signature1"][0]
      );
    if (req.files["signature2"])
      existingTemplate.signature2 = await uploadImage(
        req.files["signature2"][0]
      );

    await existingTemplate.save();
    return res.status(200).json({
      message: "Config template updated successfully",
      configTemplate: existingTemplate,
    });
  } catch (error) {
    console.error("Error updating config template:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Delete a config template by ID
exports.deleteConfigTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTemplate = await ConfigTemplate.findByIdAndDelete(id);
    if (!deletedTemplate) {
      return res.status(404).json({ message: "Config template not found" });
    }

    return res.status(200).json({
      message: "Config template deleted successfully",
      configTemplate: deletedTemplate,
    });
  } catch (error) {
    console.error("Error deleting config template:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get all config templates

// Assuming you're using a User and ConfigTemplate model
exports.getAllConfigTemplates = async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters
  try {
    const templates = await ConfigTemplate.find({ userId }); // Adjust the query as necessary
    return res.status(200).json(templates);
  } catch (error) {
    console.error("Error retrieving config templates:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get a config template by ID
exports.getConfigTemplateById = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await ConfigTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ message: "Config template not found" });
    }
    return res.status(200).json(template);
  } catch (error) {
    console.error("Error retrieving config template:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Get the latest config template
exports.getLatestConfigTemplate = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming userId is passed as a route parameter

    // Find the latest config template for the specified user by sorting `createdAt` in descending order
    const latestTemplate = await ConfigTemplate.findOne({ userId }).sort({
      createdAt: -1,
    });

    // Check if a template was found
    if (!latestTemplate) {
      return res
        .status(404)
        .json({ message: "No config templates found for this user" });
    }

    // Return the latest config template
    return res.status(200).json(latestTemplate);
  } catch (error) {
    console.error("Error retrieving the latest config template:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
