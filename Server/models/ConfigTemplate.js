// models/ConfigTemplate.js
const mongoose = require("mongoose");

const ConfigTemplateSchema = new mongoose.Schema(
  {
    clinicName: { type: String, required: true },
    doctorName: { type: String, required: true },
    logo: { type: String, required: true }, // URL for logo
    mobile: { type: Number, required: true }, 
    headerName: { type: String, required: true },
    subHeaderName: { type: String, required: true },
    footer: { type: String, required: true },
    signature1: { type: String, required: true },
    signature2: { type: String, required: true },
    patientId: { type: String },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

// Export the model
const ConfigTemplate = mongoose.model("ConfigTemplate", ConfigTemplateSchema);
module.exports = ConfigTemplate;
